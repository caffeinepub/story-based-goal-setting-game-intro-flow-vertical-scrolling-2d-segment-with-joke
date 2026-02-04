import Nat "mo:core/Nat";
import Array "mo:core/Array";

actor {
  type WallOfFameEntry = {
    id : Nat;
    name : Text;
  };

  func fromActor(id : Nat, name : Text) : WallOfFameEntry {
    { id; name };
  };

  var wallOfFameEntries : [WallOfFameEntry] = [];

  public shared ({ caller }) func addEntry(id : Nat, name : Text) : async () {
    let entry = fromActor(id, name);
    wallOfFameEntries := wallOfFameEntries.concat([entry]);
  };

  public query ({ caller }) func getAllEntries() : async [WallOfFameEntry] {
    wallOfFameEntries;
  };

  public func generateId() : async Nat {
    let size = wallOfFameEntries.size();
    size + 1;
  };
};
