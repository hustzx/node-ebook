const env =require('./env');

let resUrl;
if (env === 'dev') {
    resUrl = 'http://192.168.200.1:8081'; // 资源基础路径
} else if (env === 'prod') {
    resUrl = 'http://47.100.62.144'
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
  category
};