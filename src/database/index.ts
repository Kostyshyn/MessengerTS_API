import * as mongoose from 'mongoose';
import * as colors from 'colors';

export interface DBInterface {
  connection: mongoose.connection;

  setup(): Promise<mongoose.connection>;
}

class DataBase implements DBInterface {

  public connection: mongoose.connection;

  constructor(private uri: string) {
    mongoose.Promise = Promise;
  }

  public async setup(): Promise<mongoose.connection> {
    if (this.connection) {
      return this.connection;
    }
    try {
      this.connection = await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      console.log(colors.green('DataBase successfully connected'));
      return this.connection;
    } catch (err) {
      console.log(colors.red(`DataBase connection error:' ${err.message}`));
    }
  }
}

export default DataBase;
