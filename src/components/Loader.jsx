import "../styles.css";

export default function Loader() {
    return (
        <div className="loader-wrapper">
            <div className="loader-center">
                <div className="loader-fruits">
                    <span>🍓</span>
                    <span>🍒</span>
                    <span>🍎</span>
                    <span>🍊</span>
                    <span>🍍</span>
                    <span>🍐</span>
                    <span>🥝</span>
                </div>
                <p className="loader-text">cargando</p>
            </div>
        </div>
    );
}
