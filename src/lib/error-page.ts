export function renderErrorPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FinanceHub USA — Error</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0b2545;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    p {
      opacity: 0.8;
      margin-bottom: 1.5rem;
    }
    a {
      color: #6ee7b7;
      text-decoration: none;
      font-weight: 600;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Something went wrong</h1>
    <p>We're sorry, but the page couldn't be loaded. Please try again later.</p>
    <a href="/">← Back to home</a>
  </div>
</body>
</html>`;
}