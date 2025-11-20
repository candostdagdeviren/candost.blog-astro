---
title: "Zipping and Unzipping a Directory with All Contents in Java"
description: ""
tags:
  - programming
  - java
date: 2013-08-15T11:33:00.000Z
updateDate: 2013-08-15T11:33:00.000Z
external: false
---

## Project Mechanism

There are two public methods, and four private methods. `ziptenCikar` and `ziple` methods are public. Other methods are private.

To zip a directory or a file, there is `ziple` method in the project. This method takes two parameters. One parameter is source directory address, and the other parameter is destination file name. This method creates a stream writing a zip file to destination folder. After that it calls `diziniZiple` method.

`diziniZiple` method takes two parameters. One of them is source folder address, and the other is zip stream. This method zips a directory using buffer. If the directory has subdirectories, this method can handle this situation. The method creates subdirectories of a directory and its files.

To unzip a directory or a file, there is `ziptenCikar` method in the project. This method takes two parameters. One parameter is source .zip file’s address, and the other parameter is destination directory address. The method calls `dizinBolumu` method to check separators using correctly or not. If there is a separator end of the address, `dizinBolumu` method tells to the `ziptenCikar` method. `ziptenCikar` method also calls `dizinOlustur` method, and `dosyaCikart` method.

`dizinOlustur` method is used for creating directories to destination directory. The method takes two parameters. One of them is destination directory, and the other one is a directory name which will be created.

`dosyaCikart` function is used for extracting files from zip file to destination directory. The method takes three parameters. One of them is Zip Input Stream to get zip files content. The other parameter is destination directory. And the last one is file’s name which will be extracted.

Here is the source code and comments are also added in Turkish.

```java
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

/**
 * Kaynak gösterilen dizinin ziplenmesi hedef gösterilen dizine sıkıştırılması
 * ve kaynak gösterilen .zip dosyasının hedef gösterilen dizine çıkarılması için kullanılan sınıftır.
 *
 * @author Candost Dağdeviren
 * */
public class Zip {

 /**
 * Buffer boyutunu belirlemek için kullanılan tanımdır.
 * */
 private static final int BUFFER_BOYUTU = 4096;

 public static void main(String[] args) {
  ziple("inFolder","C:\\Documents and Settings\\candost\\Desktop\\inFolder.zip"); // Ziplemek için ilk olarak kaynak daha sonra da hedef gösteriyoruz. Burada gösterdiğimiz kaynak proje dosyamızın içinde bulunmalı
  ziptenCikar("C:\\Documents and Settings\\candost\\Desktop\\inFolder.zip", "inFolder"); //Zipten Çıkarmak için ilk olarak kaynak daha sonra hedef dosyayı belirtiyoruz.
 }

 /**
 * Kaynak gösterilen dizinin hedef gösterilen dizine .zip uzantılı olacak şekilde sıkıştırılmasıdır.
 * @param kaynak kaynak adresi olarak gösterilen dizinin <code>String</code> değeridir.
 * @param hedef hedef adresi olarak gösterilen dizinin <code>String</code> değeridir.
 * */
 public static void ziple(String kaynak, String hedef){
  try {
   ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(hedef)); // Hedef dizinine yazmak için ZipOutputStream oluşturuluyor.
   diziniZiple(kaynak,zos);  // Hedef gösterilen dizinin sıkıştırılması işlemi
   try {
    zos.close();    // Streamin kapatılması unutulmamalıdır.
   } catch (IOException e) {
    e.printStackTrace();
   }
  } catch (FileNotFoundException e) {
   e.printStackTrace();
  }
 }

 /**
 * Kaynak gösterilen .zip uzantılı dosyanın içerisindeki dosya ve dizinlerin, hedef gösterilen dizine çıkartılmasıdır.
 * @param kaynak .zip uzantılı olacak şekilde, çıkarılması istenilen dosyanın <code>String</code> değeridir.
 * @param hedef içeriğin çıkarılması istenilen hedef konumun <code>String</code> değeridir.
 * */
 public static void ziptenCikar(String kaynak, String hedef){
  File kaynakDosya = new File(kaynak);    // Kaynak dosyadan okumak için File tipinde dosya oluşturulur.
  File hedefDosya = new File(hedef);     // Hedef dosyaya yazmak için File tipinde dosya oluşturulur.

  try {
   ZipInputStream zin = new ZipInputStream(new FileInputStream(kaynakDosya)); // .zip uzantılı kaynaktan okumak için oluşturulan ZipInputStream
   ZipEntry giris;
   String isim, dizin;
   while((giris = zin.getNextEntry()) != null){  // .zip uzantılı dosyadan entry alınıyor. Alınan entry giris degiskeninde tutuluyor.
    isim = giris.getName();      // Alınan entrynin adı okunuyor.
    if(giris.isDirectory()){     // Eğer entry bir klasörse yani dizinse hedef dosyada bu dizinin oluşturulması gerekiyor.
     dizinOlustur(hedefDosya,isim);   // Hedef dosyada verilen entry adında bir dizin oluşturuluyor.
     continue;        // Dizin oluşturulduktan sonra bir sonraki entry nin alınması için while döngüsünün başına dönüyoruz.
    }

    /**
    * Verilen adres seperator içerebilir. Bu separator bir klasörle dosyayı ayırmak için mi
    * yoksa boş olarak mı konulmuştur? Bunu anlamak için bu bölümü eklemek şarttır.
    * örnek:
    *   /orn/orn.txt
    *   /orn/
    * */
    dizin = dizinBolumu(isim);     // Verilen adres separator içeriyorsa ya alt dizini vardır ya da fazladan separator vardır en sonda.
    if( dizin != null){       // Eğer null değilse alt dizini var demektir
     dizinOlustur(hedefDosya,dizin);   // Alt dizinleri yaratılır.
    }
    dosyaCikart(zin,hedefDosya,isim);   // Hedef dizine istenilen dosyayı çıkarıyor.
   }
   zin.close();         // Streami kapatıyoruz. Kapatmazsak .zip uzantılı dosya hata veriyor.
  } catch (FileNotFoundException e) {
   e.printStackTrace();
  } catch (IOException e) {
   e.printStackTrace();
  }
 }

 /**
 * Verilen dizinin bütün alt dizinleri ve içerisindeki dosyalar dahil olmak üzere
 * .zip olarak sıkıştırılmasını sağlayan fonksiyondur.
 * @param ziplenecekDizin
 * */
 private static void diziniZiple(String ziplenecekDizin, ZipOutputStream zos){

  File zipDizin = new File(ziplenecekDizin);    // Ziplenecek dizin için dosya oluşturulur.
  String[] dizinListesi = zipDizin.list();    // O dosyadaki dizinlerin listesi alınır.
  byte[] okumaBuffer = new byte[BUFFER_BOYUTU];   // .zip oluşturulurken buffer işlemi yapılacağından dolayı buffer ayarlanır.
  int bytesIn = 0;
  for(int i=0; i<dizinListesi.length;i++){    // Dizin listesindeki her dizinin tek tek işlenmesi için döngü
   File f = new File(zipDizin, dizinListesi[i]);  // Ziplenecek dizindeki dosya için dosya oluşturulur.

   if(f.isDirectory()){        // Oluşturulan dosya eğer bir dizinse
    String filePath = f.getPath();     // Oluşturulan dizinin adresi alınır.
    diziniZiple(filePath,zos);      // Bu dizinin ziplenmesi için fonksiyon recursive olarak tekrar çağrılır.
    continue;          // Dizin ziplendikten sonra bir sonrakine geçmek için döngünün başına dönülür.
   }

   FileInputStream fis=null;       // Dizinden okumak için stream açılır
   try {
    fis = new FileInputStream(f);     // Stream oluşturulan ziplenecek dosya ile eşleştirilir.
   } catch (FileNotFoundException e1) {
    e1.printStackTrace();
   }

   ZipEntry birGiris = new ZipEntry(f.getPath());  // Zip dosyasına eklemek için bir giris degeri olusturuluyor

   try {
    zos.putNextEntry(birGiris);      // Giris degeri zip e eklenmek için stream e ekleniyor.
    while((bytesIn = fis.read(okumaBuffer))!= -1){ // Ziplenecek dosyanın streami kullanılarak buffer a bir veri okunur.
     zos.write(okumaBuffer,0,bytesIn);   // Veri okuyabildiyse bu veriyi zip dosyasına yazar.
    }
    fis.close();         // Streami kapatıyoruz.
   } catch (IOException e1) {
    e1.printStackTrace();
   }
  }
 }

 /**
 *  Verilen dizinin içerisinde separator varsa bu dizinin alt dizinleri olabilir.
 *  Eğer alt dizinleri varsa önce bu alt dizinlere ulaşmak için dizin adresinin bölünmesini sağlayan fonksiyondur.
 * @param isim bölünmesi istenilen dizinin adresidir.
 * */
 private static String dizinBolumu(String isim){
  int s = isim.lastIndexOf(File.separatorChar);  // Seperator varsa seperator'den sonraki son indeks alınır. Yoksa -1 döner.
  return (s == -1) ? null : isim.substring(0,s);  // Eğer -1 ise alt dizin yoktur. -1'den farklı ise alt dizin vardır ve bu alt dizinin ismi döndürülür.
 }

 /**
 * Verilen hedef dosyaya verilen isimde dizin oluşturulmasını sağlayan fonksiyondur.
 * @param hedefDosya hedef olarak belirlenen dosyadır.
 * @param dizin oluşturulmak istenilen yeni dizinin <code>String</code> değeridir.
 * */
 private static void dizinOlustur(File hedefDosya, String dizin){
  File d = new File(hedefDosya,dizin); // Hedef dosyada bir dizin oluşturmak verilen isimde için dosya oluşturulur.
  if(!d.exists()){      // Eğer dosya geçerliyse
   d.mkdirs();       // Yeni dizin oluşturulur.
  }
 }

 /**
 * .zip dosyasının içerisindeki bir dosya için verilen Stream kullanılarak
 * hedef olan dizine, verilen isimdeki dosyanın çıkartılmasını sağlayan fonksiyondur.
 * @param gir ZipInputStream tipinde, kaynak dosyanın yani .zip dosyasının içeriğini almak için kullanılır.
 * @param hedefDosya .zip dosyasının içerisindeki çıkartılması istenilen dosyanın, hedef gösterilen dizini
 * @param isim .zip dosyasının içerisindeki çıkartılması istenilen dosyadır.
 * */
 private static void dosyaCikart(ZipInputStream gir, File hedefDosya, String isim){
  byte[] buffer = new byte[BUFFER_BOYUTU];  // Dosyanın .zip içerisinden çıkartılması için yeni buffer açılır.
  BufferedOutputStream cikisBufferı = null;  // Buffer a okumak için stream açılır.
  try {
   cikisBufferı = new BufferedOutputStream(new FileOutputStream(new File(hedefDosya,isim))); // Hedef dosyaya yazılması istenilen dosya için stream atanır.
  } catch (FileNotFoundException e1) {
   e1.printStackTrace();
  }
  int sayac = -1;         // Okunulacak olan bilgi için tutulur.
  try {
   while((sayac = gir.read(buffer)) != -1)  // .zp dosyasından buffer boyutunda bilgi okunur. Okuyamazsa -1 olduğu için okuma biter.
    cikisBufferı.write(buffer,0,sayac);  // Okunulan dosya buffer aracılığıyla hedef dosyaya yazılır.

   cikisBufferı.close();      // Buffer açık unutulmamalıdır.
  } catch (IOException e) {
   e.printStackTrace();
  }
 }
}
```
