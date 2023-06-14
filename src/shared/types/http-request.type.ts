export type HttpRequest<Body, Headers> = {
  body: Body;
  headers: Headers;
  access_token: string;
};
