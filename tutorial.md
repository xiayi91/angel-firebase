## Firebase项目创建过程
### Set up GCP key [参考](https://firebase.google.com/docs/projects/api/workflow_set-up-and-manage-project?platform=android#windows)
- 登录到 [Google Cloud Console](https://console.cloud.google.com/)
- 打开项目[Angel]
- 在左侧导航栏中选择 "IAM & Admin" > "Service accounts"
- 在 "Service accounts" 页上，选择或创建一个服务帐号
- 选择服务帐号[firebase-adminsdk]，切换到 "Keys" 标签。
- 在 "Keys" 标签页上，点击 "Add Key"，选择 JSON 格式，然后点击 "Create"。
- 文件会以 JSON 格式下载到你的计算机。
- Windows打开Powershell
  `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\service-account-file.json"`

### Firebase init [参考](https://firebase.google.com/docs/functions/get-started?gen=2nd)
- 使用 Firebase CLI，你可以在本地开发和部署 Cloud Functions。在终端或命令提示符中运行以下命令安装 
`npm install -g firebase-tools`
- 登录 Firebase (会自动打开浏览器，可能慢，耐心等待):
`firebase login` 
- 初始化 Cloud Functions:
`firebase init functions` 或者 `firebase init` 区别是前者只初始化functions，后者可以初始化firebase可选的服务，例如firestore等

### Testing on local
- 创建config
  `firebase functions:config:get > .runtimeconfig.json`
- local：`firebase emulators:start`
- local debug：`firebase emulators:start --inspect-functions`
- debug在代码里加入 `debugger; // 设置断点`
- API example:
```
curl --location 'http://127.0.0.1:5001/forum-wpyst7/us-central1/getForumsByLanguage?language=en''
```

