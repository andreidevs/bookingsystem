module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "CRMDance",
    description: "Студия пилонного спорта Edem",
    themeColor: "#057b47",
    msTileColor: "#fff",
    prefer_related_applications: true,
    appleMobileWebAppCache: "yes",
    manifestOptions: {
      background_color: "#057b47"
    },
    icons: [
      {
        src: "./img/icons/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image.png"
      }
    ]
  }
};
