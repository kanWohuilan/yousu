/* eslint-disable no-warning-comments */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { accessSync, appendFileSync, mkdirSync, readdirSync, readFile, readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { toUpper } from 'lodash-es';

const dirPath = path.resolve('./scripts/createPage/config');
const templatePath = path.resolve('./scripts/createPage/template.txt');
const requestTemplatePath = path.resolve('./scripts/createPage/requestTemplate.txt');

const routeMode = 'static'; // 路由模式 static dynamic

fileExist(dirPath);
fileExist(templatePath);

const files = readdirSync(dirPath);
files.forEach(f => {
  readFile(path.join(dirPath, f), 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }
    console.log(chalk.green(`开始处理配置${f}！`));
    const pageConfig = JSON.parse(data);
    pageConfig.fileName = f;
    // 普通文本，大文本，密码文本，数字，单选，多选,日期，时间，标签，下拉框，文件(图片，文件),数组
    generateTypes(pageConfig);
    // generatePage(pageConfig);
    // generateRouter(pageConfig);
    generateRequest(pageConfig);
    console.log(chalk.green(`配置${f}处理完成！`));

    // console.log(pageConfig);
  });
});
/**
 * 生成请求
 */
function generateRequest(config) {
  const instanceName = config.name.split('-')[0];
  const requestFile = path.resolve(`./src/service/api/${instanceName}.ts`);
  const requestIndexFile = path.resolve(`./src/service/api/index.ts`);
  const indexContent = readFileSync(requestIndexFile);
  // eslint-disable-next-line no-warning-comments
  const insertIndexContent = `export * from './${instanceName}'`;
  // TODO 此处判断可能有BUG
  if (!indexContent.toString().includes(insertIndexContent)) {
    appendFileSync(requestIndexFile, `\n${insertIndexContent};`);
  }
  const templateData = readFileSync(requestTemplatePath).toString();
  const renderData = {
    name: instanceName,
    url: config.requestUrl,
    type: config.types
  };
  fileExist(requestFile, {
    existCallback: () => {
      rmSync(requestFile);
      renderTemplate(requestFile, templateData, renderData);
      console.log(chalk.green('√ 创建请求文件完成！'));
    },
    notExistCallback: () => {
      renderTemplate(requestFile, templateData, renderData);
      console.log(chalk.green('√ 创建请求文件完成！'));
    }
  });
}

/**
 * 生成页面
 */
function generatePage(config) {
  const pageDir = path.resolve(`./src/views${config.route}`);
  const pagePath = path.resolve(`./src/views/${config.route}/index.vue`);
  if (config.route) {
    fileExist(pageDir, {
      notExistCallback: () => {
        mkdirSync(pageDir, { recursive: true });
        console.log(chalk.green('√ 创建页面文件夹完成！'));
      }
    });
    const templateData = readFileSync(templatePath);
    const templateStr = templateData.toString();
    const renderData = {
      title: config.title
    };
    fileExist(pagePath, {
      existCallback: () => {
        rmSync(pagePath);
        renderTemplate(pagePath, templateStr, renderData);
        console.log(chalk.green('√ 创建页面完成！'));
      },
      notExistCallback: () => {
        renderTemplate(pagePath, templateStr, renderData);
        console.log(chalk.green('√ 创建页面完成！'));
      }
    });
  } else {
    console.log(chalk.red(`${config.fileName}错误：配置中必须有route！`));
    process.exit(0);
  }
  generateValidation();
}
/**
 * 生成校验
 */
function generateValidation() {}

/**
 * 生成types
 */
function generateTypes(config) {
  const typesFile = path.resolve(`./src/typings/business.d.ts`);
  // if(config.types)
  const types = config.types.split('.');
  if (types.length === 1) {
    let insertStr = `interface ${types[0]} {`;
    config.parmas.forEach(item => {
      insertStr += `\n${item.name}:${item.type};`;
    });
    insertStr += '}';
    appendFileSync(typesFile, insertStr);
  } else if (types.length === 2) {
    let insertStr = `\ninterface ${types[1]} {`;
    config.parmas.forEach(item => {
      insertStr += `\n${item.name}:${item.type};`;
    });
    insertStr += '\n}';
    const typingsContent = readFileSync(typesFile);
    if (typingsContent.includes(`declare namespace ${types[0]} {`)) {
      let index = typingsContent.indexOf(`declare namespace ${types[0]} {`);
      if (index === -1) {
        console.log(chalk.red('错误： 找不到typings的namespce'));
        process.exit(2);
      } else {
        index += `declare namespace ${types[0]} {`.length;
        const result = insertIntoStr(typingsContent, index, `${insertStr}\n`);
        writeFileSync(typesFile, result);
      }
    } else {
      insertStr = `declare namespace ${types[0]} {${insertStr}\n}`;
      appendFileSync(typesFile, insertStr);
    }
  }
}

/**
 * 生成路由
 */
function generateRouter(config) {
  const pattern = /-(.+?)/gi;
  const routerName = config.name.replace(pattern, (match, tuple) => {
    return toUpper(tuple);
  });

  // 静态or动态处理
  if (routeMode === 'static') {
    // const routerFileHeader = `const ${routerName}: AuthRoute.Route = {\n`;
    // const routerFileBottom = `export default ${routerName}`;
    // 查看routeKey和path是否存在，不存在则添加
    // 一级路由是否存在
    // const static
  }
}

function fileExist(fileName, { existCallback, notExistCallback } = {}) {
  try {
    accessSync(fileName);
    if (existCallback) existCallback();
  } catch (e) {
    if (!notExistCallback) {
      console.log(chalk.red(`请检查${fileName}是否存在，或是否有读写权限`));
      process.exit(0);
    } else {
      notExistCallback();
    }
  }
}

function renderTemplate(pagePath, templateStr, renderData) {
  const pattern = /#{(.+?)}#/gim;

  const result = templateStr.replace(pattern, (match, tuple) => {
    return renderData[tuple];
  });
  // console.log(result);
  writeFileSync(pagePath, result);
  // console.log(pageConfig);
}

function insertIntoStr(source, start, newStr) {
  return source.slice(0, start) + newStr + source.slice(start);
}
