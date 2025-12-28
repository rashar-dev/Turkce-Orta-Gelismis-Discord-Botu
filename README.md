 Visual Studio Code ile Açmak
1. VS Code’u açın  
2. File → Open Folder ile bot klasörünü seçin  
3. Terminal açın (Ctrl + `)

---

 Bağımlılıkları Yüklemek
Terminalde:
npm install
veya
yarn

> Bu, botun çalışması için gerekli tüm paketleri yükler.

---

 .env Dosyasını Oluşturmak
1. Bot klasöründe `.env` adlı bir dosya oluşturun  
2. İçine şunu ekleyin:
TOKEN=BOT_TOKENINIZ
PREFIX=!

> BOT_TOKENINIZ kısmına kendi bot tokeninizi yazın  
> PREFIX bot komutlarında kullanılacak işarettir (örn: ! veya .)

---

 Botu Başlatmak
Terminalde:
node script.js

> script.js yerine botun giriş dosyasının adını yazın (ör: index.js, bot.js)  
> Bot açıldığında terminalde “Logged in as [Bot Adı]” mesajını göreceksiniz.

---

 Botu Test Etmek
- Discord sunucunuza botu ekleyin  
- Terminalde çalışırken Discord’da komutları deneyin:
!temizle “örnek”

> Botun hangi komutları desteklediğini scriptte görebilirsiniz.

---

 Öneriler
- Tokeninizi kimseyle paylaşmayın  
- Komutları test etmek için ayrı bir test sunucusu kullanın  
- Yeni başlayanlar için VS Code terminali ve Node.js sürümünüzün güncel olması önemlidir

---

 Not
Aciklamadaki Turkce kelimeleri kendi dilinize uyarlayabilirsiniz.
