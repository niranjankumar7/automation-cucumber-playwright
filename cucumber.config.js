module.exports = {
    default: {
      requireModule: ['ts-node/register'],       // transpile *.ts on the fly[5][23]
      require: [
        'src/support/hooks.ts',
        'src/steps/**/*.ts'
      ],
      format: [
        'progress',
        'html:reports/cucumber-report.html'
      ],
      paths: ['src/feature/**/*.feature']        // make sure it matches your folder
    }
  };
  