import Joi from "joi";

export interface CreateBotRequest extends Bot {
  botGoal: string;
  telegramApiKey: string;
  whatsappApiKey: string;
}

export interface Bot {
  id: number;
  prompt: string;
  telegramApiKey: string;
  file_created: number;
  file_running: number;
  database_created: number;
  assistant_content1?: string;
  assistant_content2?: string;
  assistant_content3?: string;
  user_content1?: string;
  user_content2?: string;
  user_content3?: string;
  whatsapp_enable: number;
  whatsappApiKey?: string;
  whatsappId?: string;
}

export const CreateBotSchema = Joi.object<CreateBotRequest>({
  botGoal: Joi.string().required(),
  telegramApiKey: Joi.string().required(),
  whatsappApiKey: Joi.string().required(),
  assistant_content1: Joi.string().required(),
  assistant_content2: Joi.string().required(),
  assistant_content3: Joi.string().required(),
  user_content1: Joi.string().required(),
  user_content2: Joi.string().required(),
  user_content3: Joi.string().required(),
});
