module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "EdemDance2",
    description: "Студия пилонного спорта Edem",
    themeColor: "#FF69B4",
    msTileColor: "#fff",
    prefer_related_applications: true,
    appleMobileWebAppCache: "yes",
    manifestOptions: {
      background_color: "#FF69B4"
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
