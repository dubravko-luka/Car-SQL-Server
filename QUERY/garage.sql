-- Active: 1711776426076@@103.57.223.208@1433@garage


CREATE TABLE Roles (
    role_id  INT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) NULL,
    role_slug NVARCHAR(50) UNIQUE NOT NULL,
);

CREATE TABLE CarBrands (
    brand_id INT IDENTITY(1,1) PRIMARY KEY,
    brand_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Categories (
    cate_id  INT IDENTITY(1,1) PRIMARY KEY,
    cate_name NVARCHAR(100) NOT NULL,
    cate_slug NVARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE NewsCategories (
    cate_id  INT IDENTITY(1,1) PRIMARY KEY,
    cate_name NVARCHAR(100) NOT NULL,
    cate_slug NVARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name NVARCHAR(50) NULL,
    last_name NVARCHAR(50) NULL,
    phone VARCHAR(50) NULL,
    password NVARCHAR(MAX) NOT NULL,
    role_id INT NOT NULL,
    avatar VARCHAR(255) DEFAULT 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png',
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

CREATE TABLE Cars (
    car_id INT IDENTITY(1,1) PRIMARY KEY,
    car_name NVARCHAR(100) NULL,
    brand_id INT,
    price NVARCHAR(50) DEFAULT '0',
    image NVARCHAR(MAX) NULL,
    model NVARCHAR(50) NOT NULL,
    year INT NOT NULL,
    creator_id INT,
    car_description NVARCHAR(MAX),
    -- Status: 0 - Pending, 1 - Active, 2 - Reject
    status INT DEFAULT 0, 
    cate_id INT,
    FOREIGN KEY (brand_id) REFERENCES CarBrands(brand_id) ON DELETE CASCADE,
    FOREIGN KEY (cate_id) REFERENCES Categories(cate_id) ON DELETE SET NULL,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

CREATE TABLE Contacts (
    contact_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    full_name NVARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('Male','Female','Other')),
    price_range NVARCHAR(50),
    phone NVARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE News (
    news_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    cate_id INT,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (cate_id) REFERENCES NewsCategories(cate_id) ON DELETE SET NULL,
);

INSERT INTO Roles (role_name, role_slug) VALUES
('Admin', 'admin'),
('User', 'user');

INSERT INTO CarBrands (brand_name) VALUES ('Toyota'), ('Honda'), ('Ford'), ('Mazda'), ('Kia'), ('Hyundai');

INSERT INTO Categories (cate_name, cate_slug) VALUES 
('Sedan', 'sedan'), 
('SUV', 'suv'), 
('Truck', 'truck');

INSERT INTO NewsCategories (cate_name, cate_slug) VALUES 
('Technology', 'technology'), 
('Business', 'business'), 
('Entertainment', 'entertainment');

INSERT INTO Users (username, first_name, last_name, phone, password, role_id) VALUES 
('admin', 'Admin', 'User', '123456789', '$2b$10$/oRSgr/UKaNKs35ry1xj8eCC1JPH6AaUIed6xl4b0auAzHVRsO3CG', 1), -- Pass: 1234
('user1', 'John', 'Doe', '987654321', '$2b$10$/oRSgr/UKaNKs35ry1xj8eCC1JPH6AaUIed6xl4b0auAzHVRsO3CG', 2), -- Pass: 1234
('user2', 'Jane', 'Smith', '555555555', '$2b$10$/oRSgr/UKaNKs35ry1xj8eCC1JPH6AaUIed6xl4b0auAzHVRsO3CG', 2); -- Pass: 1234

INSERT INTO Cars (car_name, brand_id, price, image, model, year, creator_id, car_description, status, cate_id) VALUES 
('Camry The he 4', 1, '25000', 'https://hondaotovinhphuc-vinhyen.vn/wp-content/uploads/2023/03/honda-civic-type-r-3649-3.jpg', '2023', 2023, 2, 'A comfortable and reliable sedan.', 0, 1),
('CR-V The he 4', 2, '28000', 'https://hondaotovinhphuc-vinhyen.vn/wp-content/uploads/2023/03/honda-civic-type-r-3649-3.jpg', '2023', 2023, 2, 'A versatile and spacious SUV.', 1, 2),
('F-150 The he 4', 3, '35000', 'https://hondaotovinhphuc-vinhyen.vn/wp-content/uploads/2023/03/honda-civic-type-r-3649-3.jpg', '2023', 2023, 2, 'A powerful and durable truck.', 2, 3);

INSERT INTO Contacts (user_id, full_name, gender, price_range, phone) VALUES 
(2, 'Alice Johnson', 'Female', '20000-30000', '123123123'),
(2, 'Bob Smith', 'Male', '25000-40000', '456456456');

INSERT INTO News (title, content, cate_id) VALUES 
('What is Lorem Ipsum?', '<div id="Translation"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3><p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p><h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p><h3>1914 translation by H. Rackham</h3><p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p><h3>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p><h3>1914 translation by H. Rackham</h3><p>"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p></div>', 1),
('Why do we use it?', '<div id="Translation"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3><p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p><h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p><h3>1914 translation by H. Rackham</h3><p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p><h3>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p><h3>1914 translation by H. Rackham</h3><p>"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p></div>', 2),
('Where does it come from?', '<div id="Translation"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3><p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p><h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p><h3>1914 translation by H. Rackham</h3><p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p><h3>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p><h3>1914 translation by H. Rackham</h3><p>"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p></div>', 3),
('Where can I get some?', '<div id="Translation"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3><p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p><h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p><h3>1914 translation by H. Rackham</h3><p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p><h3>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p><h3>1914 translation by H. Rackham</h3><p>"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p></div>', 3),
('The standard Lorem Ipsum passage, used since the 1500s', '<div id="Translation"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3><p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p><h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p><h3>1914 translation by H. Rackham</h3><p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p><h3>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p><h3>1914 translation by H. Rackham</h3><p>"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p></div>', 3),
('Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC', '<div id="Translation"><h3>The standard Lorem Ipsum passage, used since the 1500s</h3><p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p><h3>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p><h3>1914 translation by H. Rackham</h3><p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p><h3>Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3><p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p><h3>1914 translation by H. Rackham</h3><p>"On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains."</p></div>', 3);

CREATE TRIGGER CheckRoleSlugUnique
ON Roles
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted i
               INNER JOIN Roles r ON i.role_slug = r.role_slug
               WHERE i.role_id <> r.role_id)
    BEGIN
        RAISERROR ('Role slug must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;


CREATE TRIGGER CheckBrandNameUnique
ON CarBrands
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted i
               INNER JOIN CarBrands cb ON i.brand_name = cb.brand_name
               WHERE i.brand_id <> cb.brand_id)
    BEGIN
        RAISERROR ('Brand name must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;


CREATE TRIGGER CheckCategorySlugUnique
ON Categories
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted i
               INNER JOIN Categories c ON i.cate_slug = c.cate_slug
               WHERE i.cate_id <> c.cate_id)
    BEGIN
        RAISERROR ('Category slug must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;


CREATE TRIGGER CheckNewsCategorySlugUnique
ON NewsCategories
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted i
               INNER JOIN NewsCategories nc ON i.cate_slug = nc.cate_slug
               WHERE i.cate_id <> nc.cate_id)
    BEGIN
        RAISERROR ('News category slug must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;


CREATE TRIGGER UniqueUsernamePhone
ON Users
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Check uniqueness of username
    IF EXISTS (SELECT 1 FROM inserted WHERE username IN (SELECT username FROM Users GROUP BY username HAVING COUNT(*) > 1))
    BEGIN
        RAISERROR ('Username must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    -- Check uniqueness of phone
    IF EXISTS (SELECT 1 FROM inserted WHERE phone IN (SELECT phone FROM Users GROUP BY phone HAVING COUNT(*) > 1))
    BEGIN
        RAISERROR ('Phone number must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    -- Check valid phone number format (Vietnamese phone number)
    IF EXISTS (SELECT 1 FROM inserted WHERE phone NOT LIKE '[0-9]%' OR LEN(phone) <> 10)
    BEGIN
        RAISERROR ('Phone number must be a valid Vietnamese phone number.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;

CREATE TRIGGER CheckCarStatus
ON Cars
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM inserted WHERE status NOT IN (0, 1, 2))
    BEGIN
        RAISERROR ('Car status must be 0, 1, or 2.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;


-- LOGIN
CREATE FUNCTION GetUserByUsernameLogin
(
    @username NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT * FROM Users WHERE username = @username
);

-- REGISTER
CREATE PROCEDURE RegisterUser
    @username NVARCHAR(50),
    @password NVARCHAR(MAX),
    @first_name NVARCHAR(50),
    @last_name NVARCHAR(50),
    @phone VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @defaultRoleId INT;
    SET @defaultRoleId = 2; -- Default role_id = 2 user

    INSERT INTO Users (username, password, first_name, last_name, phone, role_id)
    VALUES (@username, @password, @first_name, @last_name, @phone, @defaultRoleId);
END;

-- MY ACCOUNT
CREATE PROCEDURE GetUserByUsername
    @username NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM Users WHERE username = @username;
END;

-- UPDATE ACCOUNT
CREATE PROCEDURE UpdateUserInfo
    @p_user_id INT,
    @p_first_name VARCHAR(50),
    @p_last_name VARCHAR(50),
    @p_phone VARCHAR(50),
    @p_password NVARCHAR(MAX),
    @p_avatar VARCHAR(255)
AS
BEGIN
    UPDATE Users
    SET
        first_name = @p_first_name,
        last_name = @p_last_name,
        phone = @p_phone,
        [password] = CASE WHEN @p_password IS NOT NULL THEN @p_password ELSE [password] END,
        avatar = @p_avatar
    WHERE user_id = @p_user_id;
END;

-- MY CARS
CREATE PROCEDURE GetMyCars
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Cars.car_id,
           Cars.car_name,
           Cars.price,
           Cars.image,
           Cars.model,
           Cars.year,
           Cars.car_description,
           Cars.status,
           CarBrands.brand_id,
           CarBrands.brand_name,
           Categories.cate_id,
           Categories.cate_name,
           Categories.cate_slug
    FROM Cars
    INNER JOIN CarBrands ON Cars.brand_id = CarBrands.brand_id
    INNER JOIN Categories ON Cars.cate_id = Categories.cate_id
    WHERE Cars.creator_id = @user_id;
END;


-- GET ALL CATEGORY
CREATE VIEW CategoryList AS
SELECT cate_id, cate_name, cate_slug
FROM Categories;


-- GET ALL BRAND
CREATE VIEW CarBrandList AS
SELECT brand_id, brand_name
FROM CarBrands;

-- CREATE CAR
CREATE PROCEDURE CreateCar
    @car_name NVARCHAR(100),
    @brand_id INT,
    @price NVARCHAR(50),
    @image NVARCHAR(MAX),
    @model NVARCHAR(50),
    @year INT,
    @creator_id INT,
    @car_description NVARCHAR(MAX),
    @cate_id INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Cars (car_name, brand_id, price, image, model, year, creator_id, car_description, cate_id)
    VALUES (@car_name, @brand_id, @price, @image, @model, @year, @creator_id, @car_description, @cate_id);
END;

-- DELETE CAR
CREATE PROCEDURE DeleteCar
    @car_id INT,
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Cars WHERE car_id = @car_id AND creator_id = @user_id;
END;

-- CAR DETAIL
CREATE FUNCTION GetCarDetail
(
    @carId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT Cars.*,
           CarBrands.brand_name AS brand_name, 
           Users.username AS creator_username,
           Users.first_name AS creator_first_name, 
           Users.last_name AS creator_last_name,
           Users.phone AS creator_phone, 
           Users.avatar AS creator_avatar, 
           Categories.cate_name AS cate_name
    FROM Cars
    LEFT JOIN CarBrands ON Cars.brand_id = CarBrands.brand_id
    LEFT JOIN Categories ON Cars.cate_id = Categories.cate_id
    LEFT JOIN Users ON Cars.creator_id = Users.user_id
    WHERE Cars.car_id = @carId
);

-- UPDATE CAR
CREATE PROCEDURE UpdateCar
    @car_id INT,
    @car_name NVARCHAR(100),
    @brand_id INT,
    @price NVARCHAR(50),
    @image NVARCHAR(MAX),
    @model NVARCHAR(50),
    @year INT,
    @car_description NVARCHAR(MAX),
    @cate_id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Cars
    SET car_name = @car_name,
        brand_id = @brand_id,
        price = @price,
        image = @image,
        model = @model,
        year = @year,
        car_description = @car_description,
        cate_id = @cate_id,
        status = 0 -- Đặt status về 0
    WHERE car_id = @car_id;
END;

-- GET MY CONTACT
CREATE FUNCTION GetContactsByUserId
(
    @user_id INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT *
    FROM Contacts
    WHERE user_id = @user_id
);

-- DELETE CONTACT
CREATE PROCEDURE DeleteContact
    @contact_id INT,
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Contacts
    WHERE contact_id = @contact_id AND user_id = @user_id;
END;

-- CREATE CONTACT
CREATE PROCEDURE CreateContact
    @user_id INT,
    @full_name NVARCHAR(100),
    @gender VARCHAR(10),
    @price_range NVARCHAR(50),
    @phone NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Contacts (user_id, full_name, gender, price_range, phone)
    VALUES (@user_id, @full_name, @gender, @price_range, @phone);
END;

-- GET LIST USER EXCLUDING ROLE ADMIN
CREATE VIEW UsersExcludingRole1 AS
SELECT *
FROM Users
WHERE role_id != 1;

-- GET LIST CAR WITH FILTER
CREATE FUNCTION GetCarsInfo
(
    @car_name NVARCHAR(100),
    @brand_id INT,
    @cate_id INT,
    @model NVARCHAR(50),
    @year INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT Cars.*, 
           CarBrands.brand_name AS brand_name, 
           Users.username AS creator_username,
           Users.first_name AS creator_first_name, 
           Users.last_name AS creator_last_name,
           Users.phone AS creator_phone, 
           Users.avatar AS creator_avatar, 
           Categories.cate_name AS cate_name
    FROM Cars
    INNER JOIN CarBrands ON Cars.brand_id = CarBrands.brand_id
    INNER JOIN Users ON Cars.creator_id = Users.user_id
    INNER JOIN Categories ON Cars.cate_id = Categories.cate_id
    WHERE (Cars.car_name LIKE '%' + @car_name + '%' OR @car_name IS NULL)
      AND (Cars.brand_id = @brand_id OR @brand_id IS NULL)
      AND (Cars.cate_id = @cate_id OR @cate_id IS NULL)
      AND (Cars.model LIKE '%' + @model + '%' OR @model IS NULL)
      AND (Cars.year = @year OR @year IS NULL)
      AND Cars.status = 1
);

-- GET RANDOM 6 NEWS
CREATE PROCEDURE GetRandomNews
AS
BEGIN
    SELECT TOP 6 news_id, title, content, cate_id, createdAt
    FROM News
    ORDER BY NEWID();
END;

-- GET RAMDOM CAR
CREATE PROCEDURE GetRandomCars
AS
BEGIN
    SELECT TOP 3 
        Cars.*,
        CarBrands.brand_name AS brand_name,
        Users.username AS creator_username,
        Users.first_name AS creator_first_name,
        Users.last_name AS creator_last_name,
        Users.phone AS creator_phone,
        Users.avatar AS creator_avatar,
        Categories.cate_name AS cate_name
    FROM Cars
    INNER JOIN CarBrands ON Cars.brand_id = CarBrands.brand_id
    INNER JOIN Users ON Cars.creator_id = Users.user_id
    INNER JOIN Categories ON Cars.cate_id = Categories.cate_id
    ORDER BY NEWID();
END;

-- GET NEWS DETAIL
CREATE FUNCTION GetNewsDetail
(
    @p_news_id INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT News.news_id,
           News.title,
           News.content,
           News.cate_id,
           News.createdAt,
           NewsCategories.cate_name
    FROM News
    INNER JOIN NewsCategories ON News.cate_id = NewsCategories.cate_id
    WHERE News.news_id = @p_news_id
);

-- GET LIST CAR FOR AMDIN
CREATE VIEW CarsViewAdmin AS
SELECT Cars.*, 
       CarBrands.brand_name AS brand_name, 
       Users.username AS creator_username,
       Users.first_name AS creator_first_name, 
       Users.last_name AS creator_last_name,
       Users.phone AS creator_phone, 
       Users.avatar AS creator_avatar, 
       Categories.cate_name AS cate_name
FROM Cars
INNER JOIN CarBrands ON Cars.brand_id = CarBrands.brand_id
INNER JOIN Users ON Cars.creator_id = Users.user_id
LEFT JOIN Categories ON Cars.cate_id = Categories.cate_id;

-- UPDATE STATUS CAR
CREATE PROCEDURE UpdateCarStatus
    @p_car_id INT,
    @p_status INT
AS
BEGIN
    UPDATE Cars
    SET status = @p_status
    WHERE car_id = @p_car_id;
END;

-- GET 6 CAR WITH BRAND_ID
CREATE FUNCTION GetSixCarsInfoByBrandOrCategory
(
    @p_brand_id INT = NULL,
    @p_cate_id INT = NULL
)
RETURNS TABLE
AS
RETURN
(
    SELECT TOP 6 
        Cars.*, 
        CarBrands.brand_name AS brand_name, 
        Users.username AS creator_username,
        Users.first_name AS creator_first_name, 
        Users.last_name AS creator_last_name,
        Users.phone AS creator_phone, 
        Users.avatar AS creator_avatar, 
        Categories.cate_name AS cate_name
    FROM 
        Cars
    INNER JOIN 
        CarBrands ON Cars.brand_id = CarBrands.brand_id
    INNER JOIN 
        Users ON Cars.creator_id = Users.user_id
    INNER JOIN 
        Categories ON Cars.cate_id = Categories.cate_id
    WHERE 
        ((Cars.brand_id = @p_brand_id OR @p_brand_id IS NULL)
        OR (Cars.cate_id = @p_cate_id OR @p_cate_id IS NULL))
        AND Cars.status <> 0 AND Cars.status <> 2
);

-- GET 4 NEW WITH CATE_ID
CREATE FUNCTION GetFourNewsByCategoryId
(
    @p_cate_id INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT TOP 4 
        News.*, 
        NewsCategories.cate_name AS cate_name
    FROM 
        News
    INNER JOIN 
        NewsCategories ON News.cate_id = NewsCategories.cate_id
    WHERE 
        News.cate_id = @p_cate_id
);



-- ---------------

Select @@version
