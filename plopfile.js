module.exports = function (plop) {
  // component generator
  plop.setGenerator('component', {
    description: 'Creates a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name: ',
      },
      {
        type: 'list',
        name: 'service',
        message: 'Service Folder',
        default: 'components',
        choices: [
          'Toktok',
          'ToktokBills',
          'ToktokFood',
          'ToktokGo',
          'ToktokLoad',
          'ToktokMall',
          'ToktokWallet',
          'SuperApp',
        ],
      },
      {
        type: 'list',
        name: 'folder',
        message: 'Component folder',
        default: 'components',
        choices: [
          'components',
          'components/Modal',
          'compositions',
          'compositions/Cart',
          'compositions/Order',
          'compositions/Activities',
          'compositions/OrderDetails',
          'compositions/OrderStatus',
          'compositions/ShopOverview',
          'screens/LandingScreens',
          'screens/LandingScreens/ToktokFoodActivities/tabs',
          'screens/RootScreens',
        ],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{service}}/{{folder}}/{{pascalCase name}}/{{pascalCase name}}.js',
        templateFile: 'plop-templates/component.js.hbs',
      },
      {
        type: 'add',
        path: 'src/{{service}}/{{folder}}/{{pascalCase name}}/index.js',
        templateFile: 'plop-templates/index.js.hbs',
      },
      {
        type: 'add',
        path: 'src/{{service}}/{{folder}}/{{pascalCase name}}/__tests__/{{name}}.test.js',
        templateFile: 'plop-templates/test.js.hbs',
      },
      {
        type: 'add',
        path: 'src/{{service}}/{{folder}}/{{pascalCase name}}/types.js',
        templateFile: 'plop-templates/types.js.hbs',
      },
      {
        type: 'add',
        path: 'src/{{service}}/{{folder}}/{{pascalCase name}}/Styled.js',
        templateFile: 'plop-templates/styled.js.hbs',
      },
      {
        type: 'add',
        path: 'src/{{service}}/{{folder}}/{{pascalCase name}}/README.md',
        templateFile: 'plop-templates/README.md.hbs',
      },
    ],
  });
};
