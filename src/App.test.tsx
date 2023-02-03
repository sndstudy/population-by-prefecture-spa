import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { PrefecturesResponse } from './api/fetch-data';
import App from './App';

const server = setupServer(
  rest.get(
    'https://opendata.resas-portal.go.jp/api/v1/prefectures',
    (req, res, ctx) => {
      return res(
        ctx.delay(500),
        ctx.json<PrefecturesResponse>({
          message: 'テストメッセージ',
          result: [
            { prefCode: '1', prefName: '北海道' },
            { prefCode: '2', prefName: '青森県' },
            { prefCode: '3', prefName: '岩手県' },
          ],
        }),
      );
    },
  ),
);

describe('Mainのテスト', () => {
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  it('初期描画', async () => {
    const { asFragment } = render(<App />);

    await waitFor(() => {
      const checkBoxList = screen.getAllByRole('checkbox');
      expect(checkBoxList.length).toBe(3);
      checkBoxList.forEach((v) => {
        // チェックが付いていないことを確認
        expect(v).not.toBeChecked();
      });
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
