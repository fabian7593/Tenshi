
import request from "supertest";
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

describe("Notification Endpoints", () => {

  const jwt = config.TEST.JWT_TEST;
  const apiKey = config.SERVER.SECRET_API_KEY;      
  const baseUrl = config.COMPANY.BACKEND_HOST; 
  let createdNotificationId: any;
  let createdNotificationCode: any;

  it("should create a new Notification", async () => {
    const response = await request(baseUrl)
      .post("notification/add")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        code: "test_code"+Date.now(),
        type: "test_type",
        subject: "test_subject",
        message: "test_message",
        required_send_email: 1,
        is_delete_after_read: 1,
        action_url: "test_action_url",
        language: "es"
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id");

    createdNotificationId = response.body.data.id;
    createdNotificationCode = response.body.data.code;
  });

  it("should update an existing Notification", async () => {
    const response = await request(baseUrl)
      .put(`notification/edit?id=${createdNotificationId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        code: "test_code"+Date.now(),
        type: "test_type",
        subject: "test_subject",
        message: "test_message",
        required_send_email: 0,
        is_delete_after_read: 0,
        action_url: "test_action_url",
        language: "es"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdNotificationId);
  });

  it("should get a Notification by Id", async () => {
    const response = await request(baseUrl)
      .get(`notification/get?id=${createdNotificationId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdNotificationId);
  });

  it("should get all Notification with pagination", async () => {
    const response = await request(baseUrl)
      .get(`notification/get_all`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should delete an existing Notification", async () => {
    const response = await request(baseUrl)
      .delete(`notification/delete?id=${createdNotificationId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
  });
});
