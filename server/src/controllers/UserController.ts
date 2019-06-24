import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

class UserController {
  constructor() {
    this.getUsersList = this.getUsersList.bind(this);
  }

  public getUsersList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.aggregate()
        .facet({
          items: [{ $project: { password: 0, refreshToken: 0 } }, { $skip: 0 }, { $limit: 2 }],
          meta: [{ $count: 'totalItems' }, { $addFields: { page: 1 } }]
        })
        .addFields({ meta: { $arrayElemAt: ['$meta', 0] } });

      res.send(users[0]);
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;
