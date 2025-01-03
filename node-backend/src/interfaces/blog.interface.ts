interface ICreateBlog {
  type: string;
  title: string;
  description: string;
}

interface IUpdateBlog {
  type: string;
  title: string;
  description: string;
}

export { ICreateBlog, IUpdateBlog };
