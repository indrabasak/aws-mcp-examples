export class ServerlessEcrPlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      'package:compileFunctions': this.resolveImage.bind(this)
    };
  }

  async resolveImage() {
    const ecr = this.serverless.service.provider.ecr;
    await this.serverless.getProvider('aws').resolveImageUriAndSha('appimage');
  }
}
