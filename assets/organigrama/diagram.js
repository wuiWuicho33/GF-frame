function init() {
    const $ = go.GraphObject.make;

    // --------------------------
    // Inicialización del diagrama principal
    // --------------------------
    const myDiagram = $(go.Diagram, "myDiagramDiv", {
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 50, nodeSpacing: 20 }),
        "undoManager.isEnabled": true,
        "draggingTool.isCopyEnabled": false,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "allowZoom": true
    });

    window.myDiagram = myDiagram; // Exponer globalmente

    let isEditMode = false;
    let originalModel = null;
    let originalVisibility = null; // Para guardar el estado de los checkboxes al entrar en Edición

    // --------------------------
    // Minimap / Overview
    // --------------------------
    const myOverview = $(go.Overview, "myOverviewDiv", {
        observed: myDiagram,
        contentAlignment: go.Spot.Center
    });


    // Función Helper para obtener el nombre del padre (Agrupador)
    function getParentName(data) {
        if (data.parent && window.myDiagram) {
            const parentNode = window.myDiagram.model.findNodeDataForKey(data.parent);
            return parentNode ? parentNode.name : "";
        }
        return ""; // Devuelve cadena vacía si no tiene jefe
    }

    // --------------------------
    // FUNCIÓN HELPER PARA VISIBILIDAD
    // --------------------------
    function isFieldVisible(fieldKey) {
        // Usa los valores seleccionados por el usuario (window.visibleNodeFields) o los valores por defecto
        if (!window.visibleNodeFields) return ['photo', 'name', 'role'].includes(fieldKey);
        return window.visibleNodeFields.includes(fieldKey);
    }


    // --------------------------
    // Plantilla de Nodo (Unificada para lectura y edición)
    // --------------------------
    function createNodeTemplate(isEditable) {
        
        const nodeDefinition = $(go.Node, "Vertical",
            // Configuración de movimiento y reparenting (solo si es editable)
            { 
                movable: isEditable, 
                copyable: false, 
                deletable: false,
                mouseDrop: isEditable ? (e, node) => {
                    const sel = node.diagram.selection.first();
                    if (sel && sel !== node) {
                        node.diagram.model.startTransaction("reparent");
                        node.diagram.model.setParentKeyForNodeData(sel.data, node.data.key);
                        node.diagram.model.commitTransaction("reparent");
                        
                        // *** AJUSTE: Solo habilitar botón, sin cambiar el texto ***
                        document.getElementById('saveBtn').disabled = false;
                    }
                } : null
            },
            
            $(go.Panel, "Auto",
                {
                    click: (e, obj) => {
                        const node = obj.part;
                        if (window.showModal) window.showModal(node.data); 
                    }
                },
                $(go.Shape, "RoundedRectangle", { fill: "#D3D3D3", strokeWidth: 0, name: "SHAPE", width: 150 }), 
                
                // PANEL PRINCIPAL
                $(go.Panel, "Vertical", { margin: 8, alignment: go.Spot.Center, width: 140 },
                    
                    // 1. FOTO
                    $(go.Picture,
                        { 
                            width: 50, height: 50, stretch: go.GraphObject.Uniform, margin: new go.Margin(0, 0, 4, 0),
                            visible: isFieldVisible('photo') // CONTROL DE VISIBILIDAD
                        },
                        new go.Binding("source", "photo")
                    ),
                    
                    // 2. NOMBRE
                    $(go.TextBlock,
                        { 
                            font: "bold 13px sans-serif", stroke: "black", textAlign: "center", margin: new go.Margin(0, 0, 2, 0),
                            visible: isFieldVisible('name') // CONTROL DE VISIBILIDAD
                        },
                        new go.Binding("text", "name")
                    ),
                    
                    // 3. DATOS ADICIONALES
                    $(go.Panel, "Vertical", { alignment: go.Spot.Center, margin: new go.Margin(4, 0, 0, 0) },
                        
                        // No. Empleado
                        $(go.TextBlock, 
                            { font: "11px sans-serif", stroke: "black", visible: isFieldVisible('employeeNumber') }, 
                            new go.Binding("text", "employeeId")
                        ),
                        
                        // Área
                        $(go.TextBlock, 
                            { font: "11px sans-serif", stroke: "black", visible: isFieldVisible('area') }, 
                            new go.Binding("text", "area")
                        ),
                        
                        // Cargo
                        $(go.TextBlock, 
                            { font: "11px sans-serif", stroke: "black", visible: isFieldVisible('role') }, 
                            new go.Binding("text", "role")
                        ),
                        
                        // Sueldo
                        $(go.TextBlock, 
                            { font: "11px sans-serif", stroke: "black", visible: isFieldVisible('salary') }, 
                            new go.Binding("text", "salary")
                        ),

                        // Agrupador (Jefe)
                        $(go.TextBlock, 
                          { 
                              font: "11px sans-serif", stroke: "black", margin: new go.Margin(2, 0, 0, 0), 
                              visible: isFieldVisible('manager') // CONTROL DE VISIBILIDAD
                          }, 
                          new go.Binding("text", "", getParentName)
                        )
                    )
                )
            ),
            $("TreeExpanderButton", { name: "TREEBUTTON" })
        );
        
        return nodeDefinition;
    }

    function nodeTemplateReadOnly() { return createNodeTemplate(false); }
    function nodeTemplateEditable() { return createNodeTemplate(true); }


    // --------------------------
    // Enlaces entre nodos
    // --------------------------
    myDiagram.linkTemplate = $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5 },
        $(go.Shape, { strokeWidth: 3, stroke: "#555" })
    );

    // --------------------------
    // Datos iniciales del diagrama
    // --------------------------
    const nodeDataArray = [
        { key: 1, parent: undefined, name: "Luis Moreno", role: "CEO", photo: "https://cdn.balkan.app/shared/1.jpg", employeeId: 1001, area: "Dirección General", salary: "$50,000.00 MXN" },
        { key: 2, parent: 1, name: "Ana Pérez", role: "CTO", photo: "https://cdn.balkan.app/shared/2.jpg", employeeId: 2002, area: "Tecnologías de la Información", salary: "$45,000.00 MXN" },
        { key: 3, parent: 1, name: "Carlos Ruiz", role: "CFO", photo: "https://cdn.balkan.app/shared/3.jpg", employeeId: 3003, area: "Finanzas", salary: "$40,000.00 MXN" },
        { key: 4, parent: 2, name: "Laura Gómez", role: "Dev Manager", photo: "https://cdn.balkan.app/shared/4.jpg", employeeId: 4004, area: "Tecnologías de la Información", salary: "$30,000.00 MXN" },
        { key: 5, parent: 2, name: "Miguel Torres", role: "QA Manager", photo: "https://cdn.balkan.app/shared/5.jpg", employeeId: 5005, area: "Tecnologías de la Información", salary: "$28,000.00 MXN" },
        { key: 6, parent: 4, name: "Sofía Ramírez", role: "Frontend Developer", photo: "https://cdn.balkan.app/shared/6.jpg", employeeId: 6006, area: "Tecnologías de la Información", salary: "$18,000.00 MXN" },
        { key: 7, parent: 4, name: "Diego Fernández", role: "Backend Developer", photo: "https://cdn.balkan.app/shared/7.jpg", employeeId: 7007, area: "Tecnologías de la Información", salary: "$19,000.00 MXN" },
        { key: 8, parent: 5, name: "Paula Sánchez", role: "QA Engineer", photo: "https://cdn.balkan.app/shared/8.jpg", employeeId: 8008, area: "Tecnologías de la Información", salary: "$17,000.00 MXN" },
        { key: 9, parent: 5, name: "Jorge Martínez", role: "QA Engineer", photo: "https://cdn.balkan.app/shared/9.jpg", employeeId: 9009, area: "Tecnologías de la Información", salary: "$17,000.00 MXN" },
        { key: 10, parent: 3, name: "Mariana López", role: "Accountant", photo: "https://cdn.balkan.app/shared/10.jpg", employeeId: 1010, area: "Finanzas", salary: "$22,000.00 MXN" }
    ];

    myDiagram.nodeTemplate = nodeTemplateReadOnly();
    myDiagram.model = new go.TreeModel(nodeDataArray);

    // --------------------------
    // Botones Editar / Guardar / Cancelar / Ver Todo (Flujo Limpio)
    // --------------------------
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const zoomFitBtn = document.getElementById("zoomFitBtn");
    const dropdownWrapper = document.querySelector(".dropdown-wrapper"); // Componente del select

    editBtn.addEventListener("click", () => {
        isEditMode = true;
        
        // 1. Guardar estados originales (Modelo de datos y visibilidad)
        originalModel = myDiagram.model.toJson();
        originalVisibility = window.visibleNodeFields ? [...window.visibleNodeFields] : ['photo', 'name', 'role'];

        // 2. Aplicar modo edición y plantilla editable
        myDiagram.nodeTemplate = nodeTemplateEditable();
        myDiagram.requestUpdate();

        // 3. Mostrar/Ocultar UI de edición
        editBtn.style.display = "none";
        zoomFitBtn.style.display = "none"; 
        
        dropdownWrapper.style.display = "inline-block"; // Mostrar el select
        saveBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
        
        saveBtn.disabled = true;
        // *** AJUSTE: Quitamos el reset de texto, el HTML ya dice "Guardar"
        // saveBtn.textContent = "Guardar";
        
        // Llamar al hook para que node-config.js active los listeners y configure el estado de los checkboxes
        if (window.setupVisibilityChangeTracking) {
            window.setupVisibilityChangeTracking();
        }
    });

    saveBtn.addEventListener("click", () => {
        const newModel = myDiagram.model.toJson();
        console.log("Nuevo modelo y visibilidad guardados:", { model: newModel, visibility: window.visibleNodeFields });
        
        // El estado de visibilidad actual se convierte en el nuevo estado original
        originalVisibility = [...window.visibleNodeFields]; 
        
        resetToReadOnly();
    });

    cancelBtn.addEventListener("click", () => {
        // 1. Revertir el modelo de datos
        myDiagram.model = go.Model.fromJson(originalModel);

        // 2. Revertir la visibilidad (y actualizar los checkboxes visualmente en node-config.js)
        if (window.revertVisibilityState) {
            window.revertVisibilityState(originalVisibility);
        } else {
             window.visibleNodeFields = originalVisibility; 
        }
        
        resetToReadOnly(); // Pasa a solo lectura y aplica la visibilidad revertida
    });

    function resetToReadOnly() {
        isEditMode = false;
        
        // Aplicar la plantilla de SOLO LECTURA, usando la visibilidad final (guardada o revertida)
        myDiagram.nodeTemplate = nodeTemplateReadOnly(); 
        myDiagram.requestUpdate(); // Fuerza el redibujado con la nueva plantilla/visibilidad

        // Ocultar botones de edición y el componente de configuración
        dropdownWrapper.style.display = "none"; 
        editBtn.style.display = "inline-block";
        zoomFitBtn.style.display = "inline-block"; 
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    // --------------------------
    // Botón "Ver Todo" (Auto-Zoom)
    // --------------------------
    zoomFitBtn.addEventListener("click", () => {
        if (window.myDiagram) {
            myDiagram.commandHandler.zoomToFit();
        }
    });

    // --------------------------
    // Resaltado de nodo padre candidato al arrastrar (Visualización de reparenting)
    // --------------------------
    const draggingTool = myDiagram.toolManager.draggingTool;
    let lastHighlightedNode = null;

    draggingTool.doMouseMove = function() {
        go.DraggingTool.prototype.doMouseMove.call(this);

        if (!isEditMode) return;

        const draggedNode = this.currentPart;
        if (!draggedNode) return;

        if (lastHighlightedNode && lastHighlightedNode !== draggedNode) {
            const shape = lastHighlightedNode.findObject("SHAPE");
            if (shape) shape.fill = "#D3D3D3";
            lastHighlightedNode = null;
        }

        let closestNode = null;
        let minDist = Infinity;

        myDiagram.nodes.each(node => {
            if (node === draggedNode) return;
            const nodePos = node.getDocumentPoint(go.Spot.Center);
            const draggedPos = draggedNode.getDocumentPoint(go.Spot.Center);
            const dist = draggedPos.distanceSquaredPoint(nodePos);
            if (dist < 2500 && dist < minDist) {
                closestNode = node;
                minDist = dist;
            }
        });

        if (closestNode) {
            const shape = closestNode.findObject("SHAPE");
            if (shape) shape.fill = "#1E90FF"; // Resaltar nodo candidato a ser padre
            lastHighlightedNode = closestNode;
        }
    };

    draggingTool.doDeactivate = function() {
        go.DraggingTool.prototype.doDeactivate.call(this);
        if (lastHighlightedNode) {
            const shape = lastHighlightedNode.findObject("SHAPE");
            if (shape) shape.fill = "#D3D3D3";
            lastHighlightedNode = null;
        }
    };
}

// --------------------------
// FUNCIÓN window.updateDiagramTemplate (ELIMINADA LA LÓGICA COMPLEJA)
// --------------------------
window.updateDiagramTemplate = function() {
    // Ya no se fuerza el redibujado instantáneo.
}

// Iniciar diagrama al cargar DOM
window.addEventListener('DOMContentLoaded', init);