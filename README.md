hello world





//otp table:
CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_id VARCHAR(255) NOT NULL,
    otp_code CHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

//in my.cnf
event_scheduler=ON


SHOW VARIABLES LIKE 'event_scheduler';


CREATE EVENT delete_expired_otps
ON SCHEDULE EVERY 1 MINUTE
DO
  DELETE FROM otps
  WHERE created_at < NOW() - INTERVAL 2 MINUTE;


ALTER TABLE `otps` ADD UNIQUE(`email_id`); 