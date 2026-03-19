// src/internal/slot.ts
function getTextContent(slot) {
  const nodes = slot ? slot.assignedNodes({flatten: true}) : [];
  let text = "";
  [...nodes].map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  });
  return text;
}

export {
  getTextContent
};
