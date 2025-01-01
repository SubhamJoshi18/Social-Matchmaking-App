import Blog from '../database/mongodb/models/blog.schema';
import User from '../database/mongodb/models/user.schema';
import { ICreateBlog, IUpdateBlog } from '../interfaces/blog.interface';
import { checkIfArrayisEmptyOrNot } from '../utility/instanceUtility';

class BlogRepository {
  public async storeUserBlog(userId: string, userBlog: ICreateBlog) {
    const savedResult = await Blog.create({
      user: userId,
      ...userBlog,
    });
    return savedResult;
  }

  public async storeBlogInUser(userId: string, blogId: string) {
    const savedUser = await User.findOne({ _id: userId });
    if (!savedUser) {
      throw new Error('User not found');
    }

    savedUser.blogs = Array.isArray(savedUser.blogs) ? savedUser.blogs : [];

    if (!savedUser.blogs.includes(blogId as any)) {
      savedUser.blogs.push(blogId as any);
      await savedUser.save();
    }

    return savedUser;
  }

  public async getAllUserBlog(userId: string) {
    const allUserBlog = await Blog.find({
      user: userId,
    });

    const allUserBlogCount = await Blog.find({
      user: userId,
    }).countDocuments();

    return {
      allUserBlog,
      allUserBlogCount,
    };
  }

  public async getBlogById(blogId: string) {
    const existsBlog = await Blog.findOne({
      _id: blogId,
    });

    return existsBlog;
  }

  public async updateBlogById(blogId: string, validUpdatedBody: IUpdateBlog) {
    const updatedBlog = await Blog.updateOne(
      {
        _id: blogId,
      },
      {
        ...validUpdatedBody,
      },
      {
        $new: true,
      }
    );
    return updatedBlog;
  }

  public async changeStatusBlog(blogId: string, statusParams: string) {
    return await Blog.updateOne(
      {
        _id: blogId,
      },
      {
        status: statusParams,
      },
      {
        $new: true,
      }
    );
  }
}

export default BlogRepository;
