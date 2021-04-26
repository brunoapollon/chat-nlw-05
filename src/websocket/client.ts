import { io } from "../http";
import { ConnectionsServices } from "../services/ConnectionsServices";
import { UserServices } from "../services/UsersServices";
import { MessagesServices } from "../services/MessagesServices";

interface Iparams{
  text: string;
  email: string;
}

io.on("connect", (socket) => {
  const connectionsServices = new ConnectionsServices();
  const usersServices = new UserServices();
  const messagesServices = new MessagesServices();
  // criação da conexão quando aperta o botão
  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params as Iparams;
    let user_id = null;
    const userExists = await usersServices.findByEmail(email);
    if (!userExists) {
      const user = await usersServices.create(email);
      await connectionsServices.create({
        user_id: user.id,
        socket_id
      });
      user_id = user.id;
    }else{
      const connection = await connectionsServices.findByUserId(userExists.id);
      if(!connection){
        await connectionsServices.create({
          user_id: userExists.id,
          socket_id
        });
      }else{
        connection.socket_id = socket_id;
        await connectionsServices.create(connection);
      }
     user_id = userExists.id;
    }
    
    await messagesServices.create({
      text,
      user_id
    });
    // listagem das mensagens 
    const allMessages = await messagesServices.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);
    const allUser = await connectionsServices.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUser)
  });
  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;
    const socket_id = socket.id;
    const { user_id } = await connectionsServices.findBySocketId(socket_id);
    const message = await messagesServices.create({
      text,
      user_id
    });
    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id
    });
  });
});