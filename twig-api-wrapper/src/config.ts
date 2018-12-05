export class Config {
  public apiUrl: string;

  public useProduction() {
    this.apiUrl = "https://twig-api.buildit.tools/v2";
  }

  public useStaging() {
    this.apiUrl = "https://staging-twig-api.buildit.tools/v2";
  }

  public useLocal() {
    this.apiUrl = "http://localhost:3000/v2";
  }

  public useCustomUrl(url: string) {
    this.apiUrl = url;
  }
}

export const config = new Config();
