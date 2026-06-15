import Image from 'next/image';

export default function FrogImage({ frogImage }) {
  return (
    <div className="flex justify-center items-center">
      <Image 
        src={frogImage.url}
        alt="Generated frog" 
        width={512}
        height={512}
        className="max-w-full h-auto"
      />
    </div>
  );
}
