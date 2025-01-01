import BlogService from '../../services/blogs/blog.service';
import type, { Request, Response, NextFunction, response } from 'express';
import {
  blogValidator,
  updateBlogValidator,
} from '../../validation/blog.validator';
import {
  genericErrorResponse,
  genericSuccessResponse,
} from '../../utility/responseUtility';
import httpStatus from 'http-status-codes';
import {
  checkObjectLength,
  isValidStatus,
} from '../../utility/instanceUtility';
import { fetchUserId } from '../../mappers/userProfile.mapper';
import { ICreateBlog, IUpdateBlog } from '../../interfaces/blog.interface';

class BlogController {
  private BlogService: BlogService;

  constructor() {
    this.BlogService = new BlogService();
  }

  public createBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = blogValidator.validate(req.body as ICreateBlog);

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        `Validation Error while Creating Blogs`,
        httpStatus.BAD_REQUEST
      );
    }

    const isValidObject = checkObjectLength(value as ICreateBlog);

    if (typeof isValidObject === 'boolean' && !isValidObject) {
      return genericErrorResponse(
        res,
        isValidObject,
        `The Requested Body is empty or invalid`,
        httpStatus.BAD_GATEWAY
      );
    }
    const userId = fetchUserId(req.user);

    try {
      const validJsonBody = JSON.parse(JSON.stringify(value as ICreateBlog));
      const response = await this.BlogService.createBlog(
        userId as string,
        validJsonBody as ICreateBlog
      );
      return genericSuccessResponse(
        res,
        response,
        `Blog is Created Successfully`,
        httpStatus.CREATED
      );
    } catch (err) {
      next(err);
    }
  };

  public getAllUserBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = fetchUserId(req.user);
    try {
      const response = await this.BlogService.getAllUserBlog(userId as string);
      return genericSuccessResponse(
        res,
        response,
        `All the User Blogs`,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };

  public getUserBlogById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = fetchUserId(req.user);
    const blogId = req.params.blogId;
    try {
      const response = await this.BlogService.getUserBlogById(
        userId as string,
        blogId as string
      );
      return genericSuccessResponse(
        res,
        response,
        `The Requested Blog Id : ${blogId} From the User ${userId}`,
        httpStatus.OK
      );
    } catch (err) {
      next(err);
    }
  };

  public updateTheUserBlog = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = updateBlogValidator.validate(
      req.body as IUpdateBlog
    );

    if (error) {
      return genericErrorResponse(
        res,
        error.details,
        `Update Blog Validation Exceptions`,
        httpStatus.BAD_REQUEST
      );
    }

    const isValidObject = checkObjectLength(value as IUpdateBlog);

    if (!isValidObject && typeof isValidObject === 'boolean') {
      return genericErrorResponse(
        res,
        isValidObject,
        `There is no need to update, The Requested Body is Empty`,
        httpStatus.BAD_REQUEST
      );
    }

    const userId = fetchUserId(req.user);
    const blogId = req.params.blogId;

    try {
      const validUpdate = JSON.parse(JSON.stringify(value as IUpdateBlog));

      const response = await this.BlogService.updateUser(
        userId as string,
        blogId as string,
        validUpdate as IUpdateBlog
      );

      return genericSuccessResponse(
        res,
        response,
        `The Blog ${blogId} is Updated`,
        httpStatus.BAD_REQUEST
      );
    } catch (err) {
      next(err);
    }
  };

  public changeBlogStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const statusEnum = ['Active', 'Draft', 'Archive', 'Deleted'];

    const statusParams = req.query.status;

    const isValid = isValidStatus(
      statusEnum as string[],
      statusParams as string
    );

    if (statusParams && !isValid) {
      return genericErrorResponse(
        res,
        isValid,
        `The Provided Status ${statusParams} Does not match with the Blog Status`,
        httpStatus.ACCEPTED
      );
    }
    const userId = fetchUserId(req.user);
    const blogId = req.params.blogId;
    try {
      const response = await this.BlogService.changeStatus(
        blogId as string,
        statusParams as string
      );
      return genericSuccessResponse(
        res,
        response,
        `The Status Has been updated From the Blog Id : ${blogId}`,
        httpStatus.ACCEPTED
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new BlogController();
