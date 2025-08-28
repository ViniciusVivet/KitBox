using System;
using MongoDB.Bson;
using MongoDB.Driver;

class Program
{
    static int Main(string[] args)
    {
        var conn = "mongodb://localhost:27017";
        var dbName = "kitbox";

        try
        {
            var client = new MongoClient(conn);
            var db = client.GetDatabase(dbName);
            var users = db.GetCollection<BsonDocument>("users");

            // 1) apagar docs quebrados (_id: null)
            var deleteResult = users.DeleteMany(Builders<BsonDocument>.Filter.Eq("_id", BsonNull.Value));
            Console.WriteLine($"[CLEAN] Removidos com _id:null: {deleteResult.DeletedCount}");

            // 2) garantir índice único em email
            var keys = Builders<BsonDocument>.IndexKeys.Ascending("email");
            var options = new CreateIndexOptions { Unique = true, Name = "ux_email" };
            try {
                users.Indexes.CreateOne(new CreateIndexModel<BsonDocument>(keys, options));
                Console.WriteLine("[INDEX] ux_email criado/garantido.");
            }
            catch (MongoCommandException mce) when (mce.Code == 85) // IndexOptionsConflict
            {
                Console.WriteLine("[INDEX] ux_email já existe com opções diferentes, ignorando.");
            }

            // 3) opcional: listar total
            var total = users.CountDocuments(FilterDefinition<BsonDocument>.Empty);
            Console.WriteLine($"[INFO] Total na users: {total}");

            return 0;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("[ERROR] " + ex);
            return 1;
        }
    }
}
