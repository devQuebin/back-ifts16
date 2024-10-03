const socket = io();

const usernameInput = document.getElementById("username");
const avatarUrlInput = document.getElementById("avatarUrl");
const setNameButton = document.getElementById("setNameButton");
const nameForm = document.getElementById("nameForm");
const chatForm = document.getElementById("form");
const messageInput = document.getElementById("input");
const messages = document.getElementById("messages");

let username = "";
let avatarUrl = "";

// Cargar el historial desde localStorage al iniciar
window.onload = () => {
  const storedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
  storedMessages.forEach((data) => {
    addMessageToChat(data);
  });
  window.scrollTo(0, document.body.scrollHeight);
};

// Función para agregar el mensaje al chat y localStorage
function addMessageToChat(data) {
  const item = document.createElement("li");

  if (data.avatarUrl) {
    const img = document.createElement("img");
    img.src = data.avatarUrl;
    img.alt = `${data.user} avatar`;
    item.appendChild(img);
  }

  const messageText = document.createElement("span");
  messageText.textContent = `${data.timestamp} - ${data.user}: ${data.message}`;
  item.appendChild(messageText);

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);

  // Guardar el mensaje en localStorage
  const storedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
  storedMessages.push(data);
  localStorage.setItem("chatHistory", JSON.stringify(storedMessages));
}

setNameButton.addEventListener("click", () => {
  username = usernameInput.value.trim();
  avatarUrl = avatarUrlInput.value.trim();
  if (username) {
    nameForm.style.display = "none";
    chatForm.style.display = "flex";
  }
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (messageInput.value) {
    const messageData = {
      user: username,
      avatarUrl: avatarUrl,
      message: messageInput.value,
      timestamp: new Date().toLocaleTimeString(),
    };
    socket.emit("chat message", messageData);
    messageInput.value = "";
  }
});

socket.on("chat message", (data) => {
  addMessageToChat(data);
});
