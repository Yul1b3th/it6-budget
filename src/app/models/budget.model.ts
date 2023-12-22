// app/models/budget.model.ts

export interface Budget {
  seoCampaign: boolean;
  adsCampaign: boolean;
  webCampaign: boolean;
  webCampaignObj: {
    numberOfPagesTotal: number;
    numberOfLanguagesTotal: number;
  };
  webCost: number;
  clientName: string;
  phone: string;
  email: string;
  totalBudget: number;
  date: Date;
}
