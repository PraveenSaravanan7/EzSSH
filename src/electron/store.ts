import Store, { Schema } from "electron-store";

const schema: Schema<StoreSchema> = {
  connections: {
    type: "array",
    items: {
      type: "object",
      properties: {
        host: { type: "string" },
        port: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        keyFilePath: { type: "string" },
      },
      required: ["host", "port", "username"],
    },
  },
  userInfo: {
    type: "object",
    properties: {
      email: { type: "string" },
      serialNumber: { type: "string" },
    },
    required: ["email", "serialNumber"],
  },
};

export const dataStore = new Store<StoreSchema>({ schema });
