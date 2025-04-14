<div align="center">
  <img width=30% src="https://github.com/user-attachments/assets/a92f27b9-5101-4725-8311-a0e6ada0edc7">
</div>

<h1 align="center">Time off App</h1>

The **TimeOffApp** for Rocket.Chat helps teams stay informed and organized by managing user availability during time off. It automatically notifies colleagues in direct messages when a recipient is unavailable, displaying a personalized message left by the user. This ensures clear communication and minimizes disruptions in the workflow.

<h2>Features 🚀</h2>
<ul>
  <li><b>Set Time Off Status</b>: Users can easily set their availability status and leave a personalized message for their colleagues during their time off.</li>
  <li><b>Automatic Notifications</b>: When someone sends a direct message to a user who is unavailable, they are automatically notified with the custom message left by the recipient.</li>
  <li><b>Seamless Integration</b>: Works effortlessly within Rocket.Chat, ensuring smooth communication without requiring additional tools.</li>
  <li><b>Enhanced Team Coordination</b>: Helps teams stay informed about each other's availability, reducing misunderstandings and improving collaboration.</li>
</ul>

<h2>How to Set Up 💻</h2>
<ol>
  <li>Ensure you have a Rocket.Chat server ready. If you don't have one, follow this <a href="https://developer.rocket.chat/v1/docs/server-environment-setup">guide</a>.</li>
  <li>Install the Rocket.Chat Apps Engine CLI:
  
  ```bash
  npm install -g @rocket.chat/apps-cli
  ```
  
  Verify the CLI installation:
  
  ```bash
  rc-apps -v
  # Example output: @rocket.chat/apps-cli/1.12.0 darwin-arm64 node-v22.11.0
  ```
  </li>
  <li>Clone the GitHub repository:</li>
  
  ```bash
  git clone https://github.com/RocketChat/Apps.TimeOff.git
  ```
  <li>Navigate to the repository:</li>
  
  ```bash
  cd Apps.TimeOff
  ```
  <li>Install the app dependencies:</li>
  
  ```bash
  cd app && npm install
  ```
  <li>Enable development mode on your Rocket.Chat server. Go to <i>Administration > General > Apps</i> and toggle "Enable development mode" to ON.</li>
  <li>Deploy the app to your server:</li>
  
  ```bash
  rc-apps deploy --url <server_url> --username <username> --password <password>
  ```
  
  - If running the server locally, `server_url` is typically `http://localhost:3000`. Adjust the port if necessary.
  - Replace `<username>` with your admin username.
  - Replace `<password>` with your admin password.

  <li>Open the app by navigating to <i>Administration > Marketplace > Private Apps</i>. You should see the app listed there. Click on the app name to open it and verify that it is enabled.</li>
</ol>

<h2>How to Use 💬</h2>
<p>Once the app is installed and enabled, you can use the following commands to manage your time-off status:</p>

<ul>
  <li><b>/time-off start [message]</b>: Start a new time-off period and optionally include a custom message. This will notify others who send you direct messages.</li>
  <li><b>/time-off end</b>: End your current time-off period. This will clear your status and stop notifying others that you are unavailable.</li>
  <li><b>/time-off status</b>: Check your current time-off status to see if you are marked as unavailable.</li>
  <li><b>/time-off help</b>: Display a help message with details about all available commands.</li>
</ul>

<p>These commands make it easy to manage your availability and keep your team informed.</p>

<h2>🧑‍💻 Contributing</h2>
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: adds some amazing feature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

<h2>Support us ❤️</h2>

If you like this project, please leave a star ⭐️. This helps more people to know this project.
