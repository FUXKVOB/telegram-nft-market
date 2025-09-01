import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TonConnectUIProvider, TonConnectButton, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";

function Navbar() {
  return (
    <nav className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between rounded-b-2xl shadow-lg">
      <Link to="/" className="font-bold text-xl">🎁 NFT Gifts</Link>
      <div className="space-x-4">
        <Link to="/upload" className="hover:underline">Добавить</Link>
      </div>
    </nav>
  );
}

function Home() {
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    setGifts([{ id: 1, name: "Gift #1" }, { id: 2, name: "Gift #2" }]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Маркет подарков</h1>
      {gifts.length === 0 ? (
        <p className="text-gray-500">Подарков пока нет.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <Link key={gift.id} to={`/gift/${gift.id}`} className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
              <h2 className="font-semibold text-lg">{gift.name}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function GiftDetails() {
  const { id } = useParams();
  const [gift, setGift] = useState(null);

  useEffect(() => {
    setGift({ id, name: `Gift #${id}`, description: "Описание из TON" });
  }, [id]);

  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {gift ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{gift.name}</h1>
          <p className="text-gray-500">{gift.description}</p>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </motion.div>
  );
}

function UploadGift() {
  const [name, setName] = useState("");
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet) {
      alert("Сначала подключи TON кошелёк!");
      return;
    }
    console.log("Отправка подарка:", name, "от", wallet.account.address);
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [{
        address: wallet.account.address,
        amount: "1000000" // 0.001 TON
      }]
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Добавить подарок</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Название подарка"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
          Отправить
        </button>
      </form>
    </div>
  );
}

function ConnectWallet() {
  return (
    <div className="fixed bottom-6 right-6">
      <TonConnectButton />
    </div>
  );
}

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="./tonconnect-manifest.json">
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gift/:id" element={<GiftDetails />} />
            <Route path="/upload" element={<UploadGift />} />
          </Routes>
          <ConnectWallet />
        </div>
      </Router>
    </TonConnectUIProvider>
  );
}