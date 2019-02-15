const env =require('./env');

let resUrl;
let dbHost; // 数据库地址
let dbUser; // 数据库用户
let dbPwd; // 数据库密码
if (env === 'dev') {
    resUrl = 'http://192.168.200.1:8081'; // 资源基础路径
    dbHost = 'localhost';
    dbUser = 'root';
    dbPwd = 'root'
} else if (env === 'prod') {
    resUrl = 'http://47.100.62.144';
    dbHost = '47.100.62.144';
    dbUser = 'root';
    dbPwd = '123456'
}

const category = [
    'Biomedicine',
    'BusinessandManagement',
    'ComputerScience',
    'EarthSciences',
    'Economics',
    'Engineering',
    'Education',
    'Environment',
    'Geography',
    'History',
    'Laws',
    'LifeSciences',
    'Literature',
    'SocialSciences',
    'MaterialsScience',
    'Mathematics',
    'MedicineAndPublicHealth',
    'Philosophy',
    'Physics',
    'PoliticalScienceAndInternationalRelations',
    'Psychology',
    'Statistics'
];

module.exports = {
  resUrl,
  category,
  dbHost,
  dbUser,
  dbPwd
};