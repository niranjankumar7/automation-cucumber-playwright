// src/pages/connectionsPage.ts
import { Page } from 'playwright';
import { BasePage } from './basePage';
import { logStep, logInfo } from '../utils/logger';

export class ConnectionsPage extends BasePage {
  private sourcesList = '//div[@id="sources-list"]';
  private destList    = '//div[@id="destinations-list"]';
  private sourceCard  = `${this.sourcesList}//div[starts-with(@id,"source-")]`;
  private destCard    = `${this.destList}//div[starts-with(@id,"destination-")]`;
  private dataPlane   = "//span[@class='sc-jrkPvW ebfakN text-ellipsis']";
  private writeKeySel = "//span[contains(text(),'Write key')]";

  constructor(page: Page) { super(page); }

  async assertSourceDestCount(expected = 1): Promise<void> {
    await this.closeAIPopup();
    logStep(`Validating ${expected} source and destination`);
    await this.page.waitForSelector(this.sourcesList);
    await this.page.waitForSelector(this.destList);
    const s = await this.page.locator(this.sourceCard).count();
    const d = await this.page.locator(this.destCard).count();
    if (s !== expected) throw new Error(`Sources: expected ${expected}, got ${s}`);
    if (d !== expected) throw new Error(`Destinations: expected ${expected}, got ${d}`);
    logInfo(`Sources=${s}, Destinations=${d}`);
  }

  async getDataPlaneUrl(): Promise<string> {
    await this.closeAIPopup();
    logStep('Reading Data Plane URL');
    await this.page.waitForSelector(this.dataPlane);
    const url = (await this.page.textContent(this.dataPlane))!;
    logInfo(`Data Plane URL: ${url}`);
    return url;
  }

  async getHttpSourceWriteKey(): Promise<string> {
    await this.closeAIPopup();
    logStep('Reading HTTP Source Write Key');
    await this.page.waitForSelector(this.writeKeySel);
    const txt = (await this.page.textContent(this.writeKeySel))!;
    const match = txt.match(/Write key\s+(.*)/);
    if (!match?.[1]) throw new Error(`Cannot parse write key from "${txt}"`);
    logInfo(`Write Key: ${match[1]}`);
    return match[1];
  }
}
