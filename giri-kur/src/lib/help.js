const getUsage = require('command-line-usage');

const processorSections = [
  {
    header: 'create-scss-from-raw',
    content: 'Generates a package of usable SCSS files from raw SCSS inputs',
  },
  {
    header: 'Synopsis',
    content: [
      '$ create-scss-from-raw [bold]{--src} file file file...',
      '$ create-scss-from-raw [bold]{--help}',
    ],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'src',
        typeLabel: '[underline]{file/dir}, ...',
        description: 'The input(s) to process.',
      },
      {
        name: 'dest',
        typeLabel: '[underline]{directory}',
        description: 'The output location.  Will create an scss folder inside this location.',
      },
      {
        name: 'console',
        description: 'Outputs the generated token file to the console.',
      },
      {
        name: 'verbose',
        description: 'Enables console display of events as they happen.',
      },
      {
        name: 'debugger',
        description: 'Enables any current debug statments to output.',
      },
      {
        name: 'help',
        description: 'Print this usage guide.',
      },
    ],
  },
  {
    header: 'Examples',
    content: [
      {
        desc: '1. Directory.',
        example: '$ create-scss-from-raw --src ./orig --dest ./dest',
      },
      {
        desc: '2. Single file.',
        example: '$ create-scss-from-raw --src ./orig/file.scss --dest ./dest',
      },
    ],
  },
  {
    content: 'Project home: [underline]{https://github.com/buildit/giri-kur}',
  },
];

const brandaiSections = [
  {
    header: 'incorporate-brandai',
    content: 'Downloads Brand.ai assets and incorporates them into a generated scss package',
  },
  {
    header: 'Synopsis',
    content: [
      '$ incorporate-brandai [bold]{--src} sourceDir... ',
      '$ incorporate-brandai [bold]{--help}',
    ],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'src',
        typeLabel: '[underline]{dir}, ...',
        description: 'The input to process.',
      },
      {
        name: 'console',
        description: 'Outputs the generated token file to the console.',
      },
      {
        name: 'verbose',
        description: 'Enables console display of events as they happen.',
      },
      {
        name: 'debugger',
        description: 'Enables any current debug statments to output.',
      },
      {
        name: 'cdn',
        description: 'Adds a cdn prefix to asset file variables.',
      },
      {
        name: 'account',
        description: 'Required:  Specify the brandai account name to pull from.',
      },
      {
        name: 'brand',
        description: 'Required: Specify the brand inside an account to pull from.',
      },
      {
        name: 'key',
        description: 'Specify the api key for brandai (probably required, but they can be public).',
      },
      {
        name: 'help',
        description: 'Print this usage guide.',
      },
    ],
  },
  {
    header: 'Examples',
    content: [
      {
        desc: 'Incorporate https://brandai/monksp-buildit/primary',
        example: '$ incorporate-brandai --src ./styles --account monksp-buildit --brand primary --key xyzzy',
      },
    ],
  },
  {
    content: 'Project home: [underline]{https://github.com/buildit/giri-kur}',
  },
];

export const processorHelp = () => {
  console.log(getUsage(processorSections)); // eslint-disable-line no-console
};

export const brandaiHelp = () => {
  console.log(getUsage(brandaiSections)); // eslint-disable-line no-console
};
