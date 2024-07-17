import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowAddFriend = () => {
    setShowAddFriend((curValue) => !curValue);
  };

  const handleAddToFriendList = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSelectedFriend = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSplitBill = (value) => {
    console.log(value);
    setFriends(
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  };

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <AddFriendForm onAddFriend={handleAddToFriendList} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <BillSplitForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectFriend(friend)}>Select</Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [friendName, setFriendName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const handleSubmit = (e) => {
    e.preventDefault();
    const image = `https://i.pravatar.cc/48`;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: friendName,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setFriendName('');
    setImage('https://i.pravatar.cc/48');
  };

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name: </label>
      <input
        type='text'
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>🖼️Image Url: </label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function BillSplitForm({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState('');
  const [paidByUser, setPaidbyUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const paidByFriend = billValue - paidByUser || '';

  const handleSplitBill = (e) => {
    e.preventDefault();
    console.log({ billValue, paidByFriend, paidByUser, whoIsPaying });

    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);

    setBillValue('');
    setPaidbyUser('');
    setWhoIsPaying('user');
  };

  return (
    <form className='form-split-bill' onSubmit={handleSplitBill}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰Bill value: </label>
      <input
        type='text'
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>🙍Your Expense: </label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) => setPaidbyUser(Number(e.target.value))}
      />

      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense: </label>
      <input type='text' disabled value={paidByFriend} />

      <label>🤑Who is paying for bill: </label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
