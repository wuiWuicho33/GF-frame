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

  // --------------------------
  // Minimap / Overview
  // --------------------------
  const myOverview = $(go.Overview, "myOverviewDiv", {
    observed: myDiagram,
    contentAlignment: go.Spot.Center
  });

  // --------------------------
  // Nodo en modo lectura
  // --------------------------
  function nodeTemplateReadOnly() {
    return $(go.Node, "Vertical",
      { movable: false, copyable: false, deletable: false },
      $(go.Panel, "Auto",
        {
          click: (e, obj) => {
            const node = obj.part;
            if (window.showModal) showModal(node.data);
          }
        },
        $(go.Shape, "RoundedRectangle", { fill: "#D3D3D3", strokeWidth: 0, name: "SHAPE" }),
        $(go.Panel, "Horizontal", { margin: 12 },
          $(go.Panel, "Vertical", { alignment: go.Spot.Center },
            $(go.TextBlock, { font: "bold 14px sans-serif", stroke: "black", textAlign: "left" }, new go.Binding("text", "name")),
            $(go.TextBlock, { font: "12px sans-serif", stroke: "black", textAlign: "left" }, new go.Binding("text", "role"))
          )
        )
      ),
      $("TreeExpanderButton", { name: "TREEBUTTON" })
    );
  }

  // --------------------------
  // Nodo en modo edición
  // --------------------------
  function nodeTemplateEditable() {
    return $(go.Node, "Vertical",
      {
        movable: true,
        copyable: false,
        mouseDrop: (e, node) => {
          const sel = node.diagram.selection.first();
          if (sel && sel !== node) {
            myDiagram.model.startTransaction("reparent");
            myDiagram.model.setParentKeyForNodeData(sel.data, node.data.key);
            myDiagram.model.commitTransaction("reparent");
            saveBtn.disabled = false;
          }
        }
      },
      $(go.Panel, "Auto",
        {
          click: (e, obj) => {
            const node = obj.part;
            if (window.showModal) showModal(node.data);
          }
        },
        $(go.Shape, "RoundedRectangle", { fill: "#D3D3D3", strokeWidth: 0, name: "SHAPE" }),
        $(go.Panel, "Horizontal", { margin: 12 },
          $(go.Panel, "Vertical", { alignment: go.Spot.Center, margin: new go.Margin(0,0,0,10) },
            $(go.TextBlock, { font: "bold 14px sans-serif", stroke: "black", textAlign: "left" }, new go.Binding("text", "name")),
            $(go.TextBlock, { font: "12px sans-serif", stroke: "black", textAlign: "left" }, new go.Binding("text", "role"))
          )
        )
      ),
      $("TreeExpanderButton", { name: "TREEBUTTON" })
    );
  }

  // --------------------------
  // Enlaces entre nodos
  // --------------------------
  myDiagram.linkTemplate = $(go.Link,
    { routing: go.Link.Orthogonal, corner: 5 },
    $(go.Shape, { strokeWidth: 3, stroke: "#555" })
  );

  // --------------------------
  // Datos iniciales
  // --------------------------
  const nodeDataArray = [
    { key: 1, name: "Luis Moreno", role: "CEO" },
    { key: 2, parent: 1, name: "Ana Pérez", role: "CTO" },
    { key: 3, parent: 1, name: "Carlos Ruiz", role: "CFO" },
    { key: 4, parent: 2, name: "Laura Gómez", role: "Dev Manager" },
    { key: 5, parent: 2, name: "Miguel Torres", role: "QA Manager" },
    { key: 6, parent: 4, name: "Sofía Ramírez", role: "Frontend Developer" },
    { key: 7, parent: 4, name: "Diego Fernández", role: "Backend Developer" },
    { key: 8, parent: 5, name: "Paula Sánchez", role: "QA Engineer" },
    { key: 9, parent: 5, name: "Jorge Martínez", role: "QA Engineer" },
    { key: 10, parent: 3, name: "Mariana López", role: "Accountant" }
  ];

  myDiagram.nodeTemplate = nodeTemplateReadOnly();
  myDiagram.model = new go.TreeModel(nodeDataArray);

  // --------------------------
  // Botones Editar / Guardar / Cancelar / Ver Todo
  // --------------------------
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const zoomFitBtn = document.getElementById("zoomFitBtn");

  editBtn.addEventListener("click", () => {
    isEditMode = true;
    originalModel = myDiagram.model.toJson();
    myDiagram.nodeTemplate = nodeTemplateEditable();
    myDiagram.requestUpdate();

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    zoomFitBtn.style.display = "none"; // Ocultar botón en edición
    saveBtn.disabled = true;
  });

  saveBtn.addEventListener("click", () => {
    const newModel = myDiagram.model.toJson();
    console.log("Nuevo modelo guardado:", newModel);
    resetToReadOnly();
  });

  cancelBtn.addEventListener("click", () => {
    myDiagram.model = go.Model.fromJson(originalModel);
    resetToReadOnly();
  });

  function resetToReadOnly() {
    isEditMode = false;
    myDiagram.nodeTemplate = nodeTemplateReadOnly();
    myDiagram.requestUpdate();

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    zoomFitBtn.style.display = "inline-block"; // Mostrar botón al salir de edición
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
  // Resaltado de nodo padre candidato al arrastrar
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
      if (shape) shape.fill = "#1E90FF";
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

// Iniciar diagrama al cargar DOM
window.addEventListener('DOMContentLoaded', init);
