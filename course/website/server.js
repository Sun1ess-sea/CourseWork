const sqlite3 =  require('sqlite3');
const { open } = require('sqlite');
const session = require('express-session');
const express = require('express');
const exphbs = require('express-handlebars');
const bcrypt = require('bcryptjs');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const app = express();
const port = 7777;


// Подключение к базе данных
(async () => {
    const db = await open({
      filename: './db/database.db',
      driver: sqlite3.Database
    });

  app.use(session({
    secret: 'qwe',
    resave: false,
    saveUninitialized: true
  }));

  // Настройка Handlebars
  app.engine('handlebars', engine({
      defaultLayout: 'main',
      layoutsDir: path.join(__dirname, 'views/layouts')
    }));
  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, 'views'));
  
  // Установка статической папки для CSS и JS файлов
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  
  // Подключение body-parser для обработки POST-запросов
  app.use(bodyParser.urlencoded({ extended: true }));
    
  // Настройка статических файлов
  app.use(express.urlencoded({ extended: false })); 

  app.use(bodyParser.json()); // Добавляем парсинг JSON

  // Маршрут перехода на страницу чат-бота
  app.get('/chatbot', async(req, res) => {
    res.render('chatbot');
  });

  // Маршрут для обработки сообщений чат-бота
  app.post('/chatbot', async (req, res) => {
    const userMessage = req.body.message;
    let botResponse = [];

    // Логика для ответов чат-бота
    switch (true) {
      case userMessage.includes('1'):
          botResponse.push('Наша коллегия адвокатов "Перспектива" предоставляет высококвалифицированную юридическую помощь по различным правовым вопросам. Мы стремимся защищать права и интересы наших клиентов на самом высоком уровне. Наш офис находится по адресу: город Челябинск, ул. Труда, д. 156 «В», оф. 262. Вы также можете связаться с нами по телефону 8 (922) 697-01-97 или заполнив заявку на главной странице нашего сайта.');
          break;
      case userMessage.includes('2'):
          botResponse.push('Наша коллегия занимается рассмотрением дел в следующих категориях права:');
          botResponse.push('1. Гражданское право: регулирует имущественные и связанные с ними личные неимущественные отношения.');
          botResponse.push('2. Уголовное право: регулирует общественные отношения, связанные с совершением преступлений, назначением наказаний и иных мер уголовно-правового воздействия.');
          botResponse.push('3. Финансовое право: регулирует отношения в области финансовой деятельности физических и юридических лиц.');
          botResponse.push('4. Административное право: регулирует отношения в сфере государственного управления и общественного порядка.');
          botResponse.push('5. Семейное право: регулирует брачно-семейные отношения: порядок заключения и расторжения брака, права и обязанности супругов, родителей и детей.');
          botResponse.push('6. Трудовое право: регулирует трудовые отношения между работником и работодателем, вопросы занятости и условий труда.');
          break;
      case userMessage.includes('3'):
          botResponse.push('В нашей коллегии работают высококвалифицированные адвокаты с большим опытом в различных областях права. Наши специалисты готовы предоставить Вам качественную юридическую помощь и защитить Ваши интересы.');
          botResponse.push('Михаил Степанов. Председатель Коллегии адвокатов, учредитель Коллегии. Закончил в 1994 году Московскую государственную юридическую академию имени О.Е.Кутафина. Юридический стаж 33 года. Области права: арбитражные дела, корпоративные, финансовые споры.');
          botResponse.push('Лидия Парфенова. Член Коллегии адвокатов. В 1998 году окончила Свердловский юридический институт (г. Екатеринбург). Юридический стаж 25 лет. Области права: гражданские споры в сфере жилищно-коммунальных услуг, долевого участия, дорожно-транспортных происшествий, взыскание ущерба.');
          botResponse.push('Юлия Симонова. Член Коллегии адвокатов. В 2015 году окончила Челябинский Государственный Университет. Юридический стаж 8 лет. Области права: представление интересов по делам об оспаривании сделок, оспаривании и установлении родственных связей, по делам об алиментных обязательствах, расторжении брака, разделе имущества; гражданское право и гражданский процесс.');
          botResponse.push(' Виктор Канн. Член Коллегии адвокатов. В 2013 году окончил Южно-Уральский государственный университет. Юридический стаж 10 лет. Области права: защита по уголовным делам о преступлениях против жизни и здоровья, преступлениях против собственности, общественной безопасности, по экономическим преступлениям, а также в сфере незаконного оборота наркотических средств.');
          break;
      case userMessage.includes('4'):
        const services = await db.all('SELECT * FROM services');
          if (services.length > 0) {
              botResponse.push('Вот список наших услуг:');
              services.forEach(services => {
                  botResponse.push(`${services.name_service}.`);
              });
              botResponse.push('Вы можете перейти на страницу с услугами чтобы выбрать подходящую Вам.');
          } else {
              botResponse.push('Извините, у нас пока нет доступных услуг.');
          }
          break;
      default:
          botResponse.push('Извините, я не понял ваш запрос. Пожалуйста, попробуйте задать другой вопрос из списка доступных команд.');
          break;
  }

  res.json({ responses: botResponse });
  });
  
  // Маршрут для страницы входа
  app.get('/admin/login', (req, res) => {
    res.render('login');
  });
  
  // Обработка формы входа
  app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
      if (admin && await bcrypt.compare(password, admin.password)) {
        req.session.adminId = admin.id;
        return res.redirect('/admin');
      }
      res.render('login', { error: 'Неправильный логин или пароль' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  });
  
  // Middleware для проверки аутентификации администратора
  function checkAuth(req, res, next) {
    if (req.session.adminId) {
      return next();
    }
    res.redirect('/admin/login');
  }
  
  // Маршрут для панели администратора
  app.get('/admin', checkAuth, async (req, res) => {
    try {
      const admin = await db.all('SELECT * FROM admins');
      res.render('admin', { admin });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  });
  
  // Маршрут для управления достижениями
  app.get('/admin/edit_achievements', checkAuth, async (req, res) => {
  try {
      const achievements = await db.all('SELECT * FROM achievements');
      res.render('edit_achievements', { achievements });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
  }
  });

  // Маршрут для удаления достижения
  app.post('/admin/delete_achievements', checkAuth, async (req, res) => {
    const { id } = req.body;
    try {
      await db.run('DELETE FROM achievements WHERE id = ?', id);
      res.redirect('/admin/edit_achievements');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  });

  // Маршрут для добавления достижения
  app.post('/admin/add_achievements', checkAuth, async (req, res) => {
    const { image_url, content, full_content } = req.body;
    try {
      await db.run('INSERT INTO achievements (image_url, content, full_content) VALUES (?, ?, ?)', [image_url, content, full_content]);
      res.redirect('/admin/edit_achievements');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  });

  // Middleware для переноса сообщений из сессии в локальные переменные
  app.use((req, res, next) => {
    res.locals.success_msg = req.session.success_msg;
    delete req.session.success_msg;
    next();
  });
  
    // Middleware для статических файлов (изображений)
  app.use(express.static(path.join(__dirname, 'public')));

  // Определение маршрута для главной страницы
  // Маршрут для главной страницы
  app.get('/', async(req, res) => {
      const db_achiev = await db.all('SELECT * FROM achievements');
      res.render('index', { achievements: db_achiev });
  });

  // Маршрут для отображения отдельного достижения
  app.get('/achievements/:id', async(req, res) => {
      const stmt = await db.prepare('SELECT * FROM achievements WHERE id = ?')
      await stmt.bind({ 1: req.params.id  })
      let db_achiev = await stmt.get()
      res.render('achiev_detail', { achievements: db_achiev });
  });

  // Маршрут для калькулятора услуг
  app.get('/calc_service', async (req, res) => {
  try {
      const services = await db.all('SELECT * FROM services');
      res.render('calc_service', { services });
  } catch (error) {
      console.error(error);
      res.status(500).send("Ошибка сервера");
  }
  });

  // Маршрут обработки заказа услуг
  app.post('/submit-order', async (req, res) => {
    const { client_name, client_phone, client_email, total, services } = req.body;
    console.log(req.body);

    try {
        // Вставка данных клиента в таблицу clients
        const clientResult = await db.run("INSERT INTO orders (client_name, client_phone, client_email, total) VALUES (?, ?, ?, ?)", [client_name, client_phone, client_email, total]);
        const clientId = clientResult.lastID;
        
        // Выяснение типа массива
        let serviceIds;
        if (typeof services === 'string') {
          serviceIds = services.split(',').map(id => id.trim());
        } else if (Array.isArray(services)) {
          serviceIds = services;
        } else {
          throw new Error('Invalid format for services');
        }

        // Обработка услуг
        for (const serviceId of serviceIds) {
          console.log(`Processing service ID: ${serviceId}`);
          
          await db.run("INSERT INTO service_order (client_id, service_id) VALUES (?, ?)", [clientId, serviceId]);
          console.log(`Inserted into service_order: client_id=${clientId}, service_id=${serviceId}`);
        }

        req.session.success_msg = `Спасибо, ${client_name}! Ваш заказ на сумму ${total} ₽ принят.`;
        res.redirect('/calc_service');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при сохранении данных.');
    }
  });

  // Маршрут для страницы управления услугами
  app.get('/admin/edit_services', checkAuth, async (req, res) => {
    try {
      const services = await db.all('SELECT * FROM services');
      res.render('edit_services', { services });
    } catch (error) {
      console.error(error);
      res.status(500).send("Ошибка сервера");
    }
  });

  // Маршрут для удаления услуги
  app.post('/admin/delete_service', checkAuth, async (req, res) => {
      const { service_id } = req.body;
      console.log(service_id);
      try {
        const stmt = await db.prepare("DELETE FROM services WHERE service_id = ?");
        await stmt.run(service_id);
        await stmt.finalize();
        res.redirect('/admin/edit_services');
      } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при удалении услуги.');
      }
  });

  // Маршрут для добавления новой услуги
  app.post('/admin/add_service', checkAuth, async (req, res) => {
      const { name_service, service_cost } = req.body;
      try {
        await db.run("INSERT INTO services (name_service, service_cost) VALUES (?, ?)", [name_service, service_cost]);
        res.redirect('/admin/edit_services');
      } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении услуги.');
      }
  });

  // Обработка POST-запроса с формы
  app.post('/submit', async (req, res) => {
      const { req_email, req_phone, req_name } = req.body;
      try {
        const stmt = await db.prepare("INSERT INTO requests (req_email, req_phone, req_name) VALUES (?, ?, ?)");
        await stmt.run(req_email, req_phone, req_name);
        await stmt.finalize();
        req.session.success_msg = `Спасибо, ${req_name}! Мы свяжемся с вами по указанным контактам.`;
        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при сохранении данных.');
      }
  });

  // Запуск сервера
  app.listen(port, () => {
      console.log(`Сервер http://localhost:${port}`);
  });
})();