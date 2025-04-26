import { request } from 'undici';

type BringOptions = {
  mail: string;
  password: string;
  apiKey: string;
  url?: string;
  uuid?: string;
};

type GetItemsResponseEntry = {
  specification: string;
  name: string;
};

type GetItemsResponse = {
  uuid: string;
  status: string;
  purchase: GetItemsResponseEntry[];
  recently: GetItemsResponseEntry[];
};

type AuthSuccessResponse = {
  name: string;
  uuid: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type ErrorResponse = {
  message: string;
  error: string;
  error_description: string;
  errorcode: number;
};

type GetAllUsersFromListEntry = {
  publicUuid: string;
  name: string;
  email: string;
  photoPath: string;
  pushEnabled: boolean;
  plusTryOut: boolean;
  country: string;
  language: string;
};
type GetAllUsersFromListResponse = {
  users: GetAllUsersFromListEntry[];
};

type GetListsEntry = {
  listUuid: string;
  name: string;
  theme: string;
};

type GetListsResponse = {
  lists: GetListsEntry[];
};

type GetItemsDetailsEntry = {
  uuid: string;
  itemId: string;
  listUuid: string;
  userIconItemId: string;
  userSectionId: string;
  assignedTo: string;
  imageUrl: string;
};

type MaybeResponseError<TResponse> = TResponse | ErrorResponse;

const BRING_API_URL = `https://api.getbring.com/rest/v2/`;

type BringHeaders = {
  'X-BRING-CLIENT-SOURCE': string;
  'X-BRING-COUNTRY': string;
  'X-BRING-CLIENT': string;
  'X-BRING-API-KEY': string;
  Authorization?: string;
  'X-BRING-USER-UUID'?: string;
};

export class Bring {
  private readonly mail: string;
  private readonly password: string;
  private readonly url: string;
  private userUuid: string;
  private readonly headers: BringHeaders;
  private bearerToken?: string;
  private putHeaders?: BringHeaders & {
    'Content-Type': string;
  };
  private auth?: AuthSuccessResponse;
  private tokenExpiresAt?: number;

  constructor(options: BringOptions) {
    this.mail = options.mail;
    this.password = options.password;
    this.url = options.url || BRING_API_URL;
    this.userUuid = options.uuid || ``;
    this.headers = {
      'X-BRING-API-KEY': options.apiKey,
      'X-BRING-CLIENT': `webApp`,
      'X-BRING-CLIENT-SOURCE': `webApp`,
      'X-BRING-COUNTRY': `IT`,
    };
  }

  private async refreshAuthToken(): Promise<void> {
    if (
      !this.auth ||
      !this.tokenExpiresAt ||
      Date.now() >= this.tokenExpiresAt
    ) {
      await this.login();
    }
  }

  async login(): Promise<void> {
    const { body } = await request(`${this.url}bringauth`, {
      method: 'POST',
      body: new URLSearchParams({
        email: this.mail,
        password: this.password,
      }).toString(),
      headers: {
        'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
      },
    });
    const data = (await body.json()) as MaybeResponseError<AuthSuccessResponse>;
    if ('error' in data) {
      throw new Error(`Cannot Login: ${data.message}`);
    }
    this.auth = data;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000 - 10_000;
    this.userUuid = data.uuid;
    this.bearerToken = data.access_token;
    this.headers[`X-BRING-USER-UUID`] = this.userUuid;
    this.headers[`Authorization`] = `Bearer ${this.bearerToken}`;
    this.putHeaders = {
      ...this.headers,
      ...{ 'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8` },
    };
  }

  async getLists(): Promise<GetListsResponse> {
    await this.refreshAuthToken();
    const { body } = await request(
      `${this.url}bringusers/${this.userUuid}/lists`,
      {
        headers: this.headers,
      }
    );
    const lists = (await body.json()) as MaybeResponseError<GetListsResponse>;
    if ('error' in lists) {
      throw new Error(lists.message);
    }
    return lists;
  }

  async getItems(listUuid: string): Promise<GetItemsResponse> {
    await this.refreshAuthToken();
    const { body } = await request(`${this.url}bringlists/${listUuid}`, {
      headers: this.headers,
    });
    const items = (await body.json()) as MaybeResponseError<GetItemsResponse>;
    if ('error' in items) {
      throw new Error(items.message);
    }
    return items;
  }

  async getItemsDetails(listUuid: string): Promise<GetItemsDetailsEntry[]> {
    await this.refreshAuthToken();
    const { body } = await request(
      `${this.url}bringlists/${listUuid}/details`,
      {
        headers: this.headers,
      }
    );
    const items = (await body.json()) as MaybeResponseError<
      GetItemsDetailsEntry[]
    >;
    if ('error' in items) {
      throw new Error(items.message);
    }
    return items;
  }

  async addItemToList(
    listUuid: string,
    itemName: string,
    specification: string
  ): Promise<string> {
    await this.refreshAuthToken();
    const { body } = await request(`${this.url}bringlists/${listUuid}`, {
      method: 'PUT',
      headers: this.putHeaders,
      body: new URLSearchParams({
        purchase: itemName,
        specification: specification,
        sender: 'null',
      }).toString(),
    });
    return await body.text();
  }

  async removeItemFromList(
    listUuid: string,
    itemName: string
  ): Promise<string> {
    await this.refreshAuthToken();
    const { body } = await request(`${this.url}bringlists/${listUuid}`, {
      method: 'PUT',
      headers: this.putHeaders,
      body: new URLSearchParams({
        remove: itemName,
        sender: 'null',
      }).toString(),
    });
    return await body.text();
  }

  async getAllUsersFromList(
    listUuid: string
  ): Promise<GetAllUsersFromListResponse> {
    await this.refreshAuthToken();
    const { body } = await request(`${this.url}bringlists/${listUuid}/users`, {
      headers: this.headers,
    });
    const users =
      (await body.json()) as MaybeResponseError<GetAllUsersFromListResponse>;
    if ('error' in users) {
      throw new Error(users.message);
    }
    return users;
  }
}
