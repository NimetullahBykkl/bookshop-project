// 📌 Kitaplar dizisi (Statik veri)
// Kullanıcının satın alabileceği kitapların listesini içerir.
// Her kitap için ID, başlık, yazar, fiyat, stok durumu ve kapak görseli tanımlanır.
const books = [
    { id: 1, title: "1984", author: "George Orwell", price: 90, stock: 5, cover: "./books-images/1984.png" },
    { id: 2, title: "Küçük Prens", author: "Antoine de Saint-Exupéry", price: 50, stock: 7, cover: "./books-images/KucukPrens.png" },
    { id: 3, title: "Savaş ve Barış", author: "Lev Tolstoy", price: 120, stock: 4, cover: "./books-images/SavasVeBaris.png" },
    { id: 4, title: "Sherlock Holmes", author: "Arthur Conan Doyle", price: 80, stock: 6, cover: "./books-images/SherlockHolmes.png" },
    { id: 5, title: "Simyacı", author: "Paulo Coelho", price: 95, stock: 3, cover: "./books-images/Simyaci.png" },
    { id: 6, title: "Bilinmeyen Bir Kadının Mektubu", author: "Stefan Zweig", price: 70, stock: 5, cover: "./books-images/BilinmeyenBirKadınınMektubu.png" },
    { id: 7, title: "Harry Potter", author: "J.K. Rowling", price: 110, stock: 8, cover: "./books-images/HarryPotter.png" },
    { id: 8, title: "Yüzüklerin Efendisi", author: "J.R.R. Tolkien", price: 130, stock: 4, cover: "./books-images/YüzüklerinEfendisi.png" },
    { id: 9, title: "Suç ve Ceza", author: "Fyodor Dostoyevski", price: 85, stock: 6, cover: "./books-images/SucVeCeza.png" },
    { id: 10, title: "Dönüşüm", author: "Franz Kafka", price: 60, stock: 7, cover: "./books-images/Donusum.png" },
    { id: 11, title: "Anna Karenina", author: "Lev Tolstoy", price: 100, stock: 5, cover: "./books-images/AnnaKarerina.png" },
    { id: 12, title: "Bülbülü Öldürmek", author: "Harper Lee", price: 75, stock: 6, cover: "./books-images/BulbuluOldurmek.png" }
];

// 📌 Kullanıcının sepetini saklayan dizi
// Sepet bilgileri tarayıcıda localStorage içinde tutulur.
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 📌 Kitapları ekrana listeleme fonksiyonu
function displayBooks() {
    const bookContainer = document.querySelector(".books");
    bookContainer.innerHTML = ""; // Önce içeriği temizleyerek kitapları yeniden ekliyoruz.

    books.forEach(book => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");

        // 📌 Kitap kartını oluştur
        bookElement.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3 class="title">${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.price}₺</p>
            <p>Stok: ${book.stock}</p>
            <button 
                onclick="addToCart(${book.id})" 
                ${book.stock === 0 ? "disabled" : ""}
            >
                Sepete Ekle
            </button>
        `;

        bookContainer.appendChild(bookElement);
    });
}

// 📌 Sepete kitap ekleme fonksiyonu
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);

    if (book && book.stock > 0) {
        // 📌 Kitabın kopyasını oluşturarak benzersiz bir ID ekleyelim
        const bookCopy = { ...book, uniqueId: Date.now() };
        cart.push(bookCopy); // Artık her eklenen kitap bağımsız olacak!

        localStorage.setItem("cart", JSON.stringify(cart)); // 📌 Güncellenmiş sepeti kaydet

        // 📌 Stok miktarını azalt
        book.stock--;

        // 📌 Arayüzü güncelle
        displayBooks();
        updateCartUI();
    }
}

// 📌 Sepetten kitap silme fonksiyonu
function removeFromCart(bookId) {
    const bookIndex = cart.findIndex(book => book.id === bookId); // İlk eşleşen kitabı bul

    if (bookIndex !== -1) {
        const book = cart[bookIndex]; // Silinecek kitabı al
        cart.splice(bookIndex, 1); // Sepetten çıkar

        // 📌 Stok miktarını artır
        const originalBook = books.find(b => b.id === bookId);
        if (originalBook) {
            originalBook.stock++;
        }

        localStorage.setItem("cart", JSON.stringify(cart)); // 📌 Güncellenmiş sepeti kaydet

        // 📌 Arayüzü güncelle
        displayBooks();
        updateCartUI();
    }
}

// 📌 Sepet arayüzünü güncelleme fonksiyonu
function updateCartUI() {
    const cartContainer = document.querySelector(".cart-items ul");
    const totalPriceElement = document.getElementById("total-price");

    cartContainer.innerHTML = ""; // 📌 Önce eski içeriği temizleyelim
    let totalPrice = 0;

    // 📌 Sepetteki kitapları listeleme
    cart.forEach(book => {
        const cartItem = document.createElement("li");
        cartItem.style.display = "flex";
        cartItem.style.alignItems = "center";
        cartItem.style.justifyContent = "space-between";

        // 📌 Kitap görseli
        const bookImg = document.createElement("img");
        bookImg.src = book.cover;
        bookImg.alt = book.title;
        bookImg.style.width = "50px";
        bookImg.style.borderRadius = "5px";

        // 📌 Kitap bilgisi
        const bookTitle = document.createElement("span");
        bookTitle.textContent = `${book.title} - ${book.price}₺`;
        bookTitle.style.flexGrow = "1";
        bookTitle.style.textAlign = "center";

        // 📌 Silme butonu
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteButton.style.background = "none";
        deleteButton.style.border = "none";
        deleteButton.style.color = "#ff4d4d";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.fontSize = "18px";
        deleteButton.onclick = () => removeFromCart(book.id);

        // 📌 Liste elemanına ekleme
        cartItem.appendChild(bookImg);
        cartItem.appendChild(bookTitle);
        cartItem.appendChild(deleteButton);
        cartContainer.appendChild(cartItem);

        totalPrice += book.price;
    });

    totalPriceElement.textContent = totalPrice;
}

// 📌 Sayfa yüklendiğinde kitapları ve sepeti ekrana getirme
document.addEventListener("DOMContentLoaded", () => {
    displayBooks();
    updateCartUI();
});

// 📌 Kitap arama fonksiyonu
document.getElementById("search-input").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim();
    const books = document.querySelectorAll(".book");

    books.forEach(book => {
        const title = book.querySelector(".title").textContent.toLowerCase();
        book.style.display = title.includes(searchTerm) ? "block" : "none";
    });
});

// Sepetin hareket etmesini sağlar
window.addEventListener("scroll", function () {
    const cart = document.querySelector(".cart");
    
    // Sayfanın ne kadar aşağıya indiğini kontrol et
    let scrollY = window.scrollY;

    // Sepeti belirli bir pozisyonda tut ve hareket ettir
    if (scrollY > 100) {
        cart.style.position = "fixed";
        cart.style.top = "20px"; // Sepetin ekranda görünmesini sağla
    } else {
        cart.style.position = "static"; // Normal konumuna dön
    }
});