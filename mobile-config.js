App.info({
    id: 'com.example.franlopez499.nombreapp',
    name: 'Aplicacion',
    description: 'Aplicacion con mapa para avisar de problemas',
    author: 'Fran',
    email: 'contact@example.com',
    website: 'http://example.com'
  });
  App.appendToConfig(`
    <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
        <application android:usesCleartextTraffic="true"></application>
    </edit-config>
`);
