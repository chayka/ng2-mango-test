import { HelloNg2CliPage } from './app.po';

describe('hello-ng2-cli App', () => {
  let page: HelloNg2CliPage;

  beforeEach(() => {
    page = new HelloNg2CliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
