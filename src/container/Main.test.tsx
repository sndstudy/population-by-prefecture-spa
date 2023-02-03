import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Main from './Main';
import { PrefecturesResponse } from '../api/fetch-data';
import { QueryClient, QueryClientProvider } from 'react-query';

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

  const queryClient = new QueryClient();

  it('初期描画', async () => {
    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('データ取得中')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();

    await waitFor(() => {
      const checkBoxList = screen.getAllByRole('checkbox');
      expect(checkBoxList.length).toBe(3);
      checkBoxList.forEach((v) => {
        // チェックが付いていないことを確認
        expect(v).not.toBeChecked();
      });
    });

    expect(screen.queryByText('データ取得中')).toBeNull();
    expect(asFragment()).toMatchSnapshot();
  });
});
