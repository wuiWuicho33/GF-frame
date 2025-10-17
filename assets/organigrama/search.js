window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchCount = document.getElementById("searchCount");

  function updateCount(count) {
    if (count === 1) {
      searchCount.textContent = "1 de 1 resultado";
    } else {
      searchCount.textContent = `${count} resultados`;
    }
  }

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
  });

  searchBtn.addEventListener("click", () => {
    const searchText = searchInput.value.trim().toLowerCase();
    if (!searchText) {
      updateCount(0);
      return;
    }

    const diagram = window.myDiagram;
    if (!diagram) return;

    diagram.startTransaction("highlightSearch");
    let foundNode = null;
    let matchCount = 0;

    diagram.nodes.each(node => {
      const name = node.data.name.toLowerCase();
      const role = node.data.role.toLowerCase();
      const shape = node.findObject("SHAPE");
      if (!shape) return;

      const regex = new RegExp(`\\b${searchText}\\b`, 'i');
      if (regex.test(name) || regex.test(role)) {
        shape.fill = "#1E90FF";
        matchCount++;
        if (!foundNode) foundNode = node;
      } else {
        shape.fill = "#D3D3D3";
      }
    });

    diagram.commitTransaction("highlightSearch");

    updateCount(matchCount);

    if (foundNode) {
      diagram.select(foundNode);
      diagram.centerRect(foundNode.actualBounds);
    }
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    const diagram = window.myDiagram;
    if (!diagram) return;

    diagram.startTransaction("clearSearch");
    diagram.nodes.each(node => {
      const shape = node.findObject("SHAPE");
      if (shape) shape.fill = "#D3D3D3";
    });
    diagram.commitTransaction("clearSearch");

    updateCount(0);
  });
});
