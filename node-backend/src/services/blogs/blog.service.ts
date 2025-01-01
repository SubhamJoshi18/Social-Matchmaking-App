import mongoose from 'mongoose';
import User from '../../database/mongodb/models/user.schema';
import { fetchUserId } from '../../mappers/userProfile.mapper';
import BlogRepository from '../../repository/blog.repo';
import UserRepo from '../../repository/user.repo';
import { DatabaseException } from '../../utility/exceptionUtility';
import {
  checkBothValueTrue,
  checkIfArrayisEmptyOrNot,
} from '../../utility/instanceUtility';
import { ICreateBlog, IUpdateBlog } from '../../interfaces/blog.interface';

class BlogService {
  private userRepo: UserRepo;
  private blogRepository: BlogRepository;

  constructor() {
    this.userRepo = new UserRepo();
    this.blogRepository = new BlogRepository();
  }

  public createBlog = async (userId: string, validBlogBody: ICreateBlog) => {
    const userDocuments = await this.userRepo.getUserId(userId as string);

    if ((!userDocuments && typeof userDocuments === null) || undefined) {
      throw new DatabaseException(
        null,
        `The Document does not exists for the user Id : ${userId}`
      );
    }

    const existsingUserId = fetchUserId(userDocuments);

    const userPayload = {
      ...validBlogBody,
    };

    const insertResult = await this.blogRepository.storeUserBlog(
      userId,
      userPayload
    );
    const insertBloginUser = await this.blogRepository.storeBlogInUser(
      userId,
      insertResult._id as any
    );

    return {
      insertResult,
      insertBloginUser,
    };
  };

  public getAllUserBlog = async (userId: string) => {
    const { allUserBlog, allUserBlogCount } =
      await this.blogRepository.getAllUserBlog(userId as string);

    if (String(allUserBlogCount).startsWith('0')) {
      return {
        result: `User Does not have Any Blogs or User Does not have Posted Any Blogs`,
      };
    }
    return allUserBlog;
  };

  public getUserBlogById = async (userId: string, blogId: string) => {
    const userDocuments = await this.userRepo.getUserId(userId as string);

    if (!userDocuments) {
      throw new DatabaseException(
        null,
        `The User Document does not exists on the Database Document : ${userId}`
      );
    }

    const blogDocuments = await this.blogRepository.getBlogById(
      blogId as string
    );

    const allUserBlogs = userDocuments.blogs;

    const isBlogInUser = allUserBlogs.some((blog: any) => blog.equals(blogId));

    if (!isBlogInUser) {
      throw new DatabaseException(
        null,
        `The Blog is not created or updated by the User`
      );
    }

    return blogDocuments;
  };

  public updateUser = async (
    userId: string,
    blogId: string,
    validUpdateBody: IUpdateBlog
  ) => {
    const userDocument = await this.userRepo.getUserId(userId as string);

    if (!userDocument) {
      throw new DatabaseException(
        null,
        `The User Documents Does not exists on the Database `
      );
    }

    const allUserBlogs = userDocument.blogs;

    const validBlogs = allUserBlogs.some((blog) => blog.equals(blogId));

    if (!validBlogs && typeof validBlogs === 'boolean') {
      throw new DatabaseException(
        null,
        `The Blog Id does not exists for the User ${userDocument.username}`
      );
    }

    const updatedResult = await this.blogRepository.updateBlogById(
      blogId as string,
      validUpdateBody as IUpdateBlog
    );
    const acknowledged = updatedResult.acknowledged;

    const matchReult = updatedResult.matchedCount > 0;

    const isValidUpdated = checkBothValueTrue(acknowledged, matchReult);

    if (!isValidUpdated) {
      throw new DatabaseException(null, `The Updated Operation is Invalid`);
    }

    return isValidUpdated
      ? {
          result: `${blogId} Has been Updated Successfully`,
        }
      : {
          result: `${blogId} Has not been Updated  Successfully`,
        };
  };

  public changeStatus = async (blogId: string, statusParams: string) => {
    const updatedResult = await this.blogRepository.changeStatusBlog(
      blogId as string,
      statusParams as string
    );

    return updatedResult.acknowledged && updatedResult.matchedCount > 0
      ? {
          result: `The Blog ${blogId} Has Changed The Status to ${statusParams}`,
        }
      : {
          result: `The Blog ${blogId} Cannot changed The Status`,
        };
  };
}

export default BlogService;
