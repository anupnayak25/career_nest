# Flutter -> React Native migration notes

This app mirrors core features from the Flutter app in `../app`.

Migrated now:
- Auth (login/signup) via `AuthContext` + `api.js`
- Navigation: auth stack + tabs
- Role-based dashboard
- Video recording (camera) and upload (`VideoRecorderScreen`)
- Admin Video Manager: list/search/filter/upload/delete (`VideoManagerScreen`)

API mapping (Flutter -> RN):
- `VideoService.getUserVideos()` -> `api.listVideos()`
- `VideoService.uploadVideoFile()` -> `api.uploadVideo(uri, name)`
- `VideoService.addVideo()` -> `api.saveVideoMeta(payload)`
- `VideoService.deleteVideo(id)` -> `api.deleteVideo(id)`
- `VideoService.updateVideo(id, data)` -> `api.updateVideo(id, data)`
- `VideoService.getVideosByCategory(cat)` -> `api.getVideosByCategory(cat)`

Still to port / enhance:
- Notifications: wire FCM (react-native-push-notification or Notifee + Firebase)
- Video preview: integrate `react-native-video` and add a simple player sheet
- Themed UI and animated app bars (consider `react-native-reanimated`/`moti`)
- Student dashboard parity with Flutter widgets
- Admin features beyond videos (quizzes, technical/HR/programming sets)

Environment:
- API base URL: `src/config/index.js` decides localhost vs Android emulator (10.0.2.2). Override with `API_BASE_URL` in env.

Quick verification:
- Admin users see the Video Manager on the Dashboard tab; students see `StudentDashboard`.
- Upload modal lets you choose a video from gallery and posts metadata to `/api/videos`.
