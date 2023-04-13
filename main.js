const mqtt = require('mqtt');
const mysql = require('mysql');

// MQTT connection details
const mqttHost = 'mqtt://broker.hivemq.com';
const mqttTopic = 'yusri/iot';

// MySQL connection details
const mysqlHost = 'localhost';
const mysqlUser = 'root';
const mysqlPassword = '';
const mysqlDatabase = 'pico_temperature';

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
});

// Connect to MQTT broker
const client = mqtt.connect(mqttHost);

// Subscribe to MQTT topic
client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${mqttHost}`);
  client.subscribe(mqttTopic);
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
  if (topic === mqttTopic) {
    const payload = JSON.parse(message.toString());
    console.log(`Received payload: ${JSON.stringify(payload)}`);
    savePayloadToDatabase(payload);
  }
});

// Save payload data to MySQL database
function savePayloadToDatabase(payload) {
  pool.query(
    'INSERT INTO pico1 (client_id, temperature, time) VALUES (?, ?, ?)',
    [payload.client_id, payload.temperature, new Date(payload.timestamp)],
    (error, results, fields) => {
      if (error) {
        console.error(`Error saving payload to database: ${error}`);
      } else {
        console.log(`Payload saved to database: ${JSON.stringify(payload)}`);
      }
    }
  );
}
