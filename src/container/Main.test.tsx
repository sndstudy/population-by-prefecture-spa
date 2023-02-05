import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Main from './Main';
import {
  API_PATH,
  PrefecturesResponse,
  RESAS_API_ENDPOINT,
} from '../api/fetch-data';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import userEvent from '@testing-library/user-event';

// テストのためコンソールログを抑制
setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    return;
  },
});

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
      message: 'テストメッセージ',
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

describe('Mainのテスト', () => {
  const server = setupServer(
    rest.get(
      `${RESAS_API_ENDPOINT}${API_PATH.PREFECTURES}`,
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
    rest.get(`${RESAS_API_ENDPOINT}${API_PATH.POPULATION}`, (req, res, ctx) => {
      const prefCode = req.url.searchParams.get('prefCode');
      const resData = populationData.find((v) => v.prefCode === prefCode);
      return res(ctx.json(resData?.data));
    }),
  );

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

  it('都道府県を選択して、解除する', async () => {
    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>,
    );

    const checkbox = screen.getByLabelText('北海道');

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await waitFor(() => {
      // チェックボックスとグラフの選択したラベルに都道府県名が描画されているか確認
      expect(screen.getAllByText('北海道').length).toEqual(2);
    });

    // グラフが描画されていることを確認
    expect(asFragment()).toMatchSnapshot();

    userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    await waitFor(() => {
      // チェックボックスのラベル
      expect(screen.getAllByText('北海道').length).toEqual(1);
    });

    // グラフが描画されていないことを確認
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Mainのテスト(エラーパターン)', () => {
  const server = setupServer(
    rest.get(
      `${RESAS_API_ENDPOINT}${API_PATH.PREFECTURES}`,
      (req, res, ctx) => {
        return res(
          ctx.json<{ statusCode: string }>({
            statusCode: '403',
          }),
        );
      },
    ),
    rest.get(`${RESAS_API_ENDPOINT}${API_PATH.POPULATION}`, (req, res, ctx) => {
      return res(
        ctx.json<{ statusCode: string }>({
          statusCode: '403',
        }),
      );
    }),
  );

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  const queryClient = new QueryClient();

  it('都道府県一覧APIエラー', async () => {
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
      expect(screen.queryByRole('checkbox')).toBeNull();
    });

    await waitFor(() => {
      expect(
        screen.getByText('都道府県データ取得に失敗しました'),
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('人口構成APIエラー', async () => {
    server.use(
      rest.get(
        `${RESAS_API_ENDPOINT}${API_PATH.PREFECTURES}`,
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
    );

    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const checkBoxList = screen.getAllByRole('checkbox');
      expect(checkBoxList.length).toBe(3);
    });

    expect(screen.queryByText('データ取得中')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    const checkbox = screen.getByLabelText('北海道');

    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await waitFor(() => {
      expect(
        screen.getByText('総人口データ取得に失敗しました'),
      ).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
