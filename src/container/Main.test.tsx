import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Main from './Main';
import { PrefecturesResponse } from '../api/fetch-data';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';

const populationData = [
  {
    prefCode: '1',
    data: {
      message: 'テストメッセージ',
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: '総人口',
            data: [
              {
                year: 1980,
                value: 1000,
              },
              {
                year: 1985,
                value: 2000,
              },
              {
                year: 1990,
                value: 3000,
              },
            ],
          },
        ],
      },
    },
  },
  {
    prefCode: '2',
    data: {
      message: 'テストメッセージ',
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: '総人口',
            data: [
              {
                year: 1980,
                value: 4000,
              },
              {
                year: 1985,
                value: 5000,
              },
              {
                year: 1990,
                value: 6000,
              },
            ],
          },
        ],
      },
    },
  },
  {
    prefCode: '3',
    data: {
      message: null,
      result: {
        boundaryYear: 2020,
        data: [
          {
            label: '総人口',
            data: [
              {
                year: 1980,
                value: 7000,
              },
              {
                year: 1985,
                value: 8000,
              },
              {
                year: 1990,
                value: 9000,
              },
            ],
          },
        ],
      },
    },
  },
];

const server = setupServer(
  rest.get(
    'https://opendata.resas-portal.go.jp/api/v1/prefectures',
    (req, res, ctx) => {
      return res(
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
  rest.get(
    'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear',
    (req, res, ctx) => {
      const prefCode = req.url.searchParams.get('prefCode');
      const resData = populationData.find((v) => v.prefCode === prefCode);
      return res(ctx.json(resData?.data));
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

  it('都道府県を選択(グラフ描画)', async () => {
    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>,
    );

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

    const checkbox = screen.getByLabelText('北海道');

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await waitFor(() => {
      // チェックボックスとグラフのラベル
      expect(screen.getAllByText('北海道').length).toEqual(2);
    });

    // グラフが描画されていることを確認
    expect(asFragment()).toMatchSnapshot();
  });
});
