import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IconnectionCreate {
  admin_id?: string;
  user_id: string;
  socket_id: string
  id?: string;
}

class ConnectionsServices {
  private connectionRepository: Repository<Connection>;
  constructor(){
    this.connectionRepository = getCustomRepository(ConnectionsRepository);
  }
  async create({ admin_id, user_id, socket_id, id }: IconnectionCreate){
    const connection = this.connectionRepository.create({
      admin_id,
      user_id,
      socket_id,
      id
    })

    this.connectionRepository.save(connection);
    return connection;
  }
  async findByUserId(user_id: string){
    const connection = this.connectionRepository.findOne({
      user_id
    })
    return connection;
  }
  async findAllWithoutAdmin(){
    const connections = await this.connectionRepository.find({
      where: { admin_id: null },
      relations: ["user"]
    });
    return connections;
  }
  async findBySocketId(socket_id: string){
    const connection = this.connectionRepository.findOne({
      socket_id
    });
    return connection;
  }
  async updateAdminID(user_id: string, admin_id: string){
    await this.connectionRepository.createQueryBuilder().update({ admin_id }).where("user_id = :user_id", {
      user_id
    }).execute();
  }
}

export { ConnectionsServices };