import * as mongoose from 'mongoose';
import * as colors from 'colors';

class DataBase {

  public connection;

  constructor(private url: string) {
    mongoose.Promise = Promise;
  }

  public async setup(): Promise<any> {
    if (this.connection) {
      return this.connection;
    }
    try {
      this.connection = await mongoose.connect(this.url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      console.log(colors.green('DataBase successfully connected'));
      return this.connection;
    } catch(err) {
      console.log(colors.red(`DataBase connection error:' ${ err.message }`));
    }
  }

  public seed(seeds): void {
    if (this.connection) {
      
    }
  }

}

export default DataBase;