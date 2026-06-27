export function getHtml(): string {

return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<link rel="stylesheet" href="style.css">

</head>

<body>

<div class="container">

<div class="header">

<div class="title">

🤖 QwenForge

</div>

<div class="status">

Qwen3-8B ● Connected

</div>

</div>

<div
id="chat"
class="chat"
>

</div>

<div class="footer">

<textarea

id="prompt"

placeholder="Ask Qwen..."

></textarea>

<button id="send">

➤

</button>

</div>

</div>

<script src="script.js"></script>

</body>

</html>

`;

}